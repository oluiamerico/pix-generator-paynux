package provider

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/luiamerico/pix-generator-paynux-backend/internal/domain"
)

type PaynuxV1Provider struct {
	BaseURL string
	Client  *http.Client
}

func NewPaynuxV1Provider() *PaynuxV1Provider {
	return &PaynuxV1Provider{
		// Default URL as an example, user should replace it if needed
		BaseURL: "https://api.paynuxpayments.com.br/v1",
		Client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (p *PaynuxV1Provider) GeneratePix(req domain.PixRequest) (*domain.PixResponse, error) {
	// 1. Map to Paynux V1 specific payload
	amountInCents := int(req.Amount * 100)
	docType := "cpf"
	if len(req.Document) > 14 {
		docType = "cnpj"
	}

	payload := map[string]interface{}{
		"amount":        amountInCents,
		"paymentMethod": "pix",
		"items": []map[string]interface{}{
			{
				"title":     "PIX Payment",
				"unitPrice": amountInCents,
				"quantity":  1,
				"tangible":  false,
			},
		},
		"customer": map[string]interface{}{
			"name":  req.Name,
			"email": req.Email,
			"document": map[string]interface{}{
				"number": req.Document,
				"type":   docType,
			},
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal v1 payload: %w", err)
	}

	url := fmt.Sprintf("%s/transactions", p.BaseURL)
	httpReq, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// 2. Add Authentication
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Accept", "application/json")
	httpReq.SetBasicAuth(req.PublicKey, req.SecretKey)

	// 3. Perform request
	resp, err := p.Client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		errorBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("paynux v1 api returned error status: %d, detail: %s", resp.StatusCode, string(errorBody))
	}

	// 4. Decode response
	var responseData struct {
		ID  int `json:"id"`
		Pix struct {
			Qrcode string `json:"qrcode"`
		} `json:"pix"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&responseData); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// 5. Build agnostic response
	return &domain.PixResponse{
		QRCodeBase64:  "", // V1 response doesn't seem to include base64
		PixString:     responseData.Pix.Qrcode,
		TransactionID: fmt.Sprintf("%d", responseData.ID),
	}, nil
}
