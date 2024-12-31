package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Domain specific settings.
type SslKey struct {
	ID         string      `json:"id" gorm:"size:50;primaryKey;"`
	Name       string      `json:"name"`
	PrivateKey string      `json:"private_key"`
	PublicKey  string      `json:"public_key"`
	ProxyHosts []ProxyHost `json:"proxy_hosts" gorm:"foreignKey:SslKeyID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *SslKey) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}
