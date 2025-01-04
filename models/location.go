package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/izetmolla/proxymanager/nginx"
	"gorm.io/gorm"
)

// Domain specific settings.
type Location struct {
	ID        string `json:"id" gorm:"size:50;primaryKey;"`
	Path      string `json:"path"`
	ProxyPass string `json:"proxy_pass"`

	ProxyHostID string             `json:"proxy_host_id"`
	Properties  []LocationProperty `json:"properties" gorm:"foreignKey:LocationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *Location) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

func UpdateProxyHostLocations(db *gorm.DB, phID string, locations []nginx.ProxyHostLocation) ([]nginx.ProxyHostLocation, error) {
	existInDBLocations := []Location{}
	if err := db.Where("proxy_host_id = ?", phID).Find(&existInDBLocations).Error; err != nil {
		return locations, err
	}
	for i := 0; i < len(existInDBLocations); i++ {
		found := false
		for _, location := range locations {
			if existInDBLocations[i].Path == location.Path {
				db.Where("id like ?", existInDBLocations[i].ID).Updates(&Location{ID: existInDBLocations[i].ID, ProxyPass: location.ProxyPass})
				if err := updateLocationProperties(db, existInDBLocations[i].ID, location.Properties); err != nil {
					return locations, err
				}
				found = true
				break
			}
		}
		if !found {
			if err := db.Delete(&existInDBLocations[i]).Error; err != nil {
				return locations, err
			}
			db.Where("location_id = ?", existInDBLocations[i].ID).Delete(&LocationProperty{})
		}
	}

	for _, location := range locations {
		found := false
		for i := 0; i < len(existInDBLocations); i++ {
			if existInDBLocations[i].Path == location.Path {
				db.Where("id like ?", existInDBLocations[i].ID).Updates(&Location{ID: existInDBLocations[i].ID, ProxyPass: location.ProxyPass})
				if err := updateLocationProperties(db, existInDBLocations[i].ID, location.Properties); err != nil {
					return locations, err
				}
				found = true
				break
			}
		}
		if !found {
			nl := Location{Path: location.Path, ProxyPass: location.ProxyPass, ProxyHostID: phID}
			for i := 0; i < len(location.Properties); i++ {
				nl.Properties = append(nl.Properties, LocationProperty{Property: location.Properties[i]})
			}
			if err := db.Create(&nl).Error; err != nil {
				return locations, err
			}
		}
	}
	return locations, nil

}

func updateLocationProperties(db *gorm.DB, locationID string, properties []string) error {
	if err := db.Where("location_id = ?", locationID).Delete(&LocationProperty{}).Error; err != nil {
		return err
	}
	for _, property := range properties {
		if err := db.Create(&LocationProperty{LocationID: locationID, Property: property}).Error; err != nil {
			return err
		}
	}

	return nil
}

func FormatLocations(locations []Location) []nginx.ProxyHostLocation {
	locationsFormatted := make([]nginx.ProxyHostLocation, len(locations))
	for i := 0; i < len(locations); i++ {
		properties := make([]string, len(locations[i].Properties))
		for k, v := range locations[i].Properties {
			properties[k] = v.Property
		}
		locationsFormatted[i] = nginx.ProxyHostLocation{
			ProxyPass:  locations[i].ProxyPass,
			Path:       locations[i].Path,
			Properties: properties,
		}
	}
	return locationsFormatted
}
