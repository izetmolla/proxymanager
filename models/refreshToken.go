package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Server specific settings.
type RefreshToken struct {
	ID        string `json:"id" gorm:"size:50;primaryKey;"`
	UserID    string `json:"userId" gorm:"index"`
	User      User   `json:"user" gorm:"foreignKey:UserID"`
	Token     string `json:"token"`
	Expired   bool   `json:"expired"`
	CreatedAt time.Time
}

func (b *RefreshToken) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

func CreateRefreshToken(db *gorm.DB, user_id string, token string) (string, error) {
	refreshToken := RefreshToken{
		UserID:    user_id,
		Token:     token,
		Expired:   false,
		CreatedAt: time.Now().UTC(),
	}
	db.Save(&refreshToken)
	return refreshToken.ID, nil
}

func GetRefreshToken(db *gorm.DB, tkn string) (RefreshToken, error) {
	token := RefreshToken{}
	res := db.Model(&RefreshToken{}).Where(&RefreshToken{Token: tkn}).First(&token)
	if res.Error != nil {
		return token, res.Error
	}
	return token, nil
}
