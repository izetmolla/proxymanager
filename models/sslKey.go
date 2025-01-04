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
	Type       string      `json:"type" gorm:"default:auto"`
	PrivateKey string      `json:"private_key"`
	PublicKey  string      `json:"public_key"`
	ProxyHosts []ProxyHost `json:"proxy_hosts" gorm:"foreignKey:SslKeyID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Subject            string    `json:"subject"`
	Issuer             string    `json:"issuer"`
	NotBefore          time.Time `json:"not_before"`
	NotAfter           time.Time `json:"not_after"`
	PublicKeyAlgorithm string    `json:"public_key_algorithm"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *SslKey) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

func CreateSslKey(db *gorm.DB) (ssl SslKey, err error) {
	if res := db.Model(&ssl).Create(&ssl); res.Error != nil {
		return ssl, res.Error
	}
	return ssl, err
}

func GetSslKeyByID(db *gorm.DB, id string) (ssl SslKey, err error) {
	if res := db.Model(&SslKey{}).Where("id = ?", id).First(&ssl); res.Error != nil {
		return ssl, err
	}
	return ssl, nil
}
