package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Server specific settings.
type Option struct {
	ID     string `json:"id" gorm:"size:50;primaryKey;"`
	Option string `json:"option"`
	Value  string `json:"value"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *Option) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}
