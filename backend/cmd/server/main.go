package main

import (
	"log"
	"net/http"
	"os"

	"github.com/luiamerico/pix-generator-paynux-backend/internal/handler"
	"github.com/luiamerico/pix-generator-paynux-backend/internal/usecase"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Permite o domínio da Cloudflare ou "*" para todos (menos seguro, mas resolve rápido)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Se for uma requisição de "preflight" (OPTIONS), retornamos OK imediatamente
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	log.Println("Initializing PIX Generator Backend...")

	pixUsecase := usecase.NewPixUsecase()
	pixHandler := handler.NewPixHandler(pixUsecase)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/pix/generate", pixHandler.HandleGeneratePix)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is running on port %s", port)

	if err := http.ListenAndServe(":"+port, enableCORS(mux)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
