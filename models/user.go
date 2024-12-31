package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Server specific settings.
type User struct {
	ID       string `json:"id" gorm:"size:50;primaryKey;"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Status   string `json:"status" gorm:"default:active"`

	RefreshTokens []RefreshToken `json:"refresh_tokens" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

func GetUserByUsername(db *gorm.DB, username string) (*User, error) {
	var user User
	if err := db.Where("username = ? OR email=?", username, username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
