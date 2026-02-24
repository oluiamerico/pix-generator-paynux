package usecase

import (
	"errors"
	"fmt"
	"strings"

	"github.com/luiamerico/pix-generator-paynux-backend/internal/domain"
	"github.com/luiamerico/pix-generator-paynux-backend/internal/provider"
)

type PixUsecase struct {
	v1Provider domain.PixProvider
	v2Provider domain.PixProvider
}

func NewPixUsecase() *PixUsecase {
	return &PixUsecase{
		v1Provider: provider.NewPaynuxV1Provider(),
		v2Provider: provider.NewPaynuxV2Provider(),
	}
}

func (uc *PixUsecase) GeneratePix(req domain.PixRequest) (*domain.PixResponse, error) {
	// Simple validation
	if req.Amount <= 0 {
		return nil, errors.New("amount must be greater than zero")
	}
	if req.PublicKey == "" || req.SecretKey == "" {
		return nil, errors.New("missing API keys")
	}

	version := strings.ToLower(req.Version)
	switch version {
	case "v1":
		return uc.v1Provider.GeneratePix(req)
	case "v2":
		return uc.v2Provider.GeneratePix(req)
	default:
		return nil, fmt.Errorf("unsupported paynux version: %s (must be v1 or v2)", req.Version)
	}
}
