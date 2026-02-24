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

type PaynuxV2Provider struct {
	BaseURL string
	Client  *http.Client
}

func NewPaynuxV2Provider() *PaynuxV2Provider {
	return &PaynuxV2Provider{
		BaseURL: "https://api.paynuxpayments.com.br/v2",
		Client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (p *PaynuxV2Provider) GeneratePix(req domain.PixRequest) (*domain.PixResponse, error) {
	amountInCents := int(req.Amount * 100)
	docType := "cpf"
	if len(req.Document) > 14 {
		docType = "cnpj"
	}

	payload := map[string]interface{}{
		"payment_method": "pix",
		"customer": map[string]interface{}{
			"document": map[string]interface{}{
				"type":   docType,
				"number": req.Document,
			},
			"name":  req.Name,
			"email": req.Email,
			"phone": "00000000000", // Required in example, using dummy if not provided by domain
		},
		"amount": amountInCents,
		"items": []map[string]interface{}{
			{
				"title":      "PIX Payment",
				"unit_price": amountInCents,
				"quantity":   1,
			},
		},
		"metadata": map[string]interface{}{
			"provider_name": req.Name,
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal v2 payload: %w", err)
	}

	// Based on the cURL, the V2 endpoint URL is actually different from the base one we had
	url := "https://api.paynuxpayments.com/v1/payment-transaction/create"
	httpReq, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add Authentication for V2
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Accept", "application/json")
	httpReq.SetBasicAuth(req.PublicKey, req.SecretKey)

	resp, err := p.Client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to execute v2 request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		errorBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("paynux v2 api returned error status: %d, detail: %s", resp.StatusCode, string(errorBody))
	}

	var responseData struct {
		Data struct {
			ID  string `json:"id"`
			Pix struct {
				QrCode string `json:"qr_code"`
				URL    string `json:"url"`
			} `json:"pix"`
		} `json:"data"`
		Success bool `json:"success"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&responseData); err != nil {
		return nil, fmt.Errorf("failed to decode v2 response: %w", err)
	}

	if !responseData.Success {
		return nil, fmt.Errorf("paynux v2 api returned success: false")
	}

	return &domain.PixResponse{
		QRCodeBase64:  "", // V2 doesn't return base64, usually you have to generate it yourself from the string or use a URL if provided
		QRCodeURL:     responseData.Data.Pix.URL,
		PixString:     responseData.Data.Pix.QrCode,
		TransactionID: responseData.Data.ID,
	}, nil
}
