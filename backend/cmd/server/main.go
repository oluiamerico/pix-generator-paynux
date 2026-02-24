package main

import (
	"log"
	"net/http"

	"github.com/luiamerico/pix-generator-paynux-backend/internal/handler"
	"github.com/luiamerico/pix-generator-paynux-backend/internal/usecase"
)

func main() {
	log.Println("Initializing PIX Generator Backend...")

	pixUsecase := usecase.NewPixUsecase()
	pixHandler := handler.NewPixHandler(pixUsecase)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/pix/generate", pixHandler.HandleGeneratePix)

	log.Println("Server is running on port 8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
