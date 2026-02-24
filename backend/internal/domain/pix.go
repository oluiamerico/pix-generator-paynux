package domain

type PixRequest struct {
	PublicKey string  `json:"public_key"`
	SecretKey string  `json:"secret_key"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Document  string  `json:"document"` // CPF or CNPJ
	Amount    float64 `json:"amount"`

	// Additional field for selecting version in the generic Handler
	Version   string  `json:"version"` // "v1" or "v2"
}

type PixResponse struct {
	QRCodeBase64 string `json:"qr_code_base64"`
	QRCodeURL    string `json:"qr_code_url,omitempty"`
	PixString    string `json:"pix_string"` // EMV Copy & Paste
	TransactionID string `json:"transaction_id,omitempty"`
}

type PixProvider interface {
	GeneratePix(req PixRequest) (*PixResponse, error)
}
