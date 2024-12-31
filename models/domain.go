package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Domain specific settings.
type Domain struct {
	ID          string `json:"id" gorm:"size:50;primaryKey;"`
	Name        string `json:"name"`
	ProxyHostID string `json:"proxy_host_id"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *Domain) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

func IsDomainExistOnDB(db *gorm.DB, domains []string) error {
	dms := []Domain{}
	err := db.Where("name in ?", domains).Select("name").Find(&dms).Error
	if err != nil {
		return err
	}
	if len(dms) > 0 {
		return fmt.Errorf("domain %s alredy exist", dms[0].Name)
	}
	return nil
}

func IsDomainExist(db *gorm.DB, proxyHostId string, domains []string) error {
	dms := []Domain{}
	err := db.Where("name in ? AND proxy_host_id !=?", domains, proxyHostId).Select("name").Find(&dms).Error
	if err != nil {
		return err
	}
	if len(dms) > 0 {
		return fmt.Errorf("domain %s alredy exist", dms[0].Name)
	}
	return nil
}

func UpdateProxyHostDomains(db *gorm.DB, phID string, domains []string) ([]string, error) {
	existInDBDomains := []Domain{}
	if err := db.Where("proxy_host_id = ?", phID).Find(&existInDBDomains).Error; err != nil {
		return domains, err
	}
	for i := 0; i < len(existInDBDomains); i++ {
		found := false
		for _, domain := range domains {
			if existInDBDomains[i].Name == domain {
				found = true
				break
			}
		}
		if !found {
			if err := db.Delete(&existInDBDomains[i]).Error; err != nil {
				return domains, err
			}
		}
	}

	for _, domain := range domains {
		found := false
		for i := 0; i < len(existInDBDomains); i++ {
			if existInDBDomains[i].Name == domain {
				found = true
				break
			}
		}
		if !found {
			if err := db.Create(&Domain{Name: domain, ProxyHostID: phID}).Error; err != nil {
				return domains, err
			}
		}
	}

	return domains, nil
}
