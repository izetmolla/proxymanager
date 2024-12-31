package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Domain specific settings.
type LocationProperty struct {
	ID         string `json:"id" gorm:"size:50;primaryKey;"`
	Property   string `json:"property"`
	LocationID string `json:"location_id"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *LocationProperty) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}
