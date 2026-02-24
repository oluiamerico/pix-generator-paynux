package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/luiamerico/pix-generator-paynux-backend/internal/domain"
	"github.com/luiamerico/pix-generator-paynux-backend/internal/usecase"
)

type PixHandler struct {
	PixUsecase *usecase.PixUsecase
}

func NewPixHandler(uc *usecase.PixUsecase) *PixHandler {
	return &PixHandler{
		PixUsecase: uc,
	}
}

func (h *PixHandler) HandleGeneratePix(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for frontend integration
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req domain.PixRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received PIX generation request for version: %s, email: %s", req.Version, req.Email)

	resp, err := h.PixUsecase.GeneratePix(req)
	if err != nil {
		log.Printf("Error generating PIX: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}
