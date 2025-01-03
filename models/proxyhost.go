package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/izetmolla/proxymanager/nginx"
	"gorm.io/gorm"
)

// Server specific settings.
type ProxyHost struct {
	ID        string     `json:"id" gorm:"size:50;primaryKey;"`
	Type      string     `json:"type" gorm:"default:proxy"`
	Status    string     `json:"status" gorm:"default:created"`
	Message   string     `json:"message"`
	Domains   []Domain   `json:"domains" gorm:"foreignKey:ProxyHostID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Locations []Location `json:"locations" gorm:"foreignKey:ProxyHostID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	SslKeyID  string     `json:"ssl_key_id" gorm:"size:50;"`
	Ssl       SslKey     `json:"ssl_key" gorm:"foreignKey:SslKeyID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	EnableSSL *bool      `json:"enable_ssl" gorm:"default:false"`

	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *ProxyHost) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}

type ProxyHostElements struct {
	Domains   []string
	Locations []nginx.ProxyHostLocation
}

func (b ProxyHost) FormatElements(phID string, ct map[string]interface{}) ProxyHostElements {
	return ProxyHostElements{
		Domains:   formatDomainsMap(ct),
		Locations: formatLocationsMap(ct),
	}
}

func GetProxyHostByID(db *gorm.DB, id string) (phost ProxyHost, err error) {
	if res := db.Model(&ProxyHost{}).Where("id = ?", id).
		Preload("Domains").
		Preload("Locations").
		Preload("Locations.Properties").
		Preload("Ssl").
		First(&phost); res.Error != nil {
		return phost, err
	}
	return phost, nil
}

func GetProxyHostitemByID(db *gorm.DB, id, domainName string, ssl bool) (phost ProxyHost, err error) {
	if res := db.Model(&ProxyHost{}).Where("id = ?", id).First(&phost); res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			phost.ID = id
			if ssl {
				phost.Ssl = SslKey{
					Name: fmt.Sprintf("%s - SSL Keys", domainName),
				}
			}
			phost.EnableSSL = &ssl
			if err := db.Save(&phost).Error; err != nil {
				return phost, err
			}
		}
	}
	return phost, nil
}

func SaveProxyHostItem(db *gorm.DB, id string, domains []string, locations []nginx.ProxyHostLocation) (err error) {
	if _, err := UpdateProxyHostDomains(db, id, domains); err != nil {
		return err
	}
	if _, err := UpdateProxyHostLocations(db, id, locations); err != nil {
		return err
	}
	return nil
}

func DeleteProxyHostItem(db *gorm.DB, id string) (err error) {
	if err := db.Model(&ProxyHost{}).Where("id = ?", id).Delete(&ProxyHost{}).Error; err != nil {
		return err
	}
	if db.Model(&Domain{}).Where("proxy_host_id = ?", id).Delete(&Domain{}).Error != nil {
		return err
	}
	locations := []Location{}
	locIds := []string{}
	if res := db.Model(&Location{}).Where("proxy_host_id = ?", id).Find(&locations); res.Error != nil {
		return res.Error
	}
	for _, l := range locations {
		locIds = append(locIds, l.ID)
	}
	if db.Model(&Location{}).Where("proxy_host_id = ?", id).Delete(&Location{}).Error != nil {
		return err
	}
	if db.Model(&LocationProperty{}).Where("location_id IN ?", locIds).Delete(&LocationProperty{}).Error != nil {
		return err
	}
	return nil
}
func formatDomainsMap(ct map[string]interface{}) (dd []string) {
	if domain, ok := ct["domains"]; ok {
		if domains, ok := domain.([]interface{}); ok {
			for _, d := range domains {
				dd = append(dd, d.(string))
			}
		}
	}
	fmt.Print(dd)
	return dd
}

func formatLocationsMap(ct map[string]interface{}) (nl []nginx.ProxyHostLocation) {
	if location, ok := ct["locations"]; ok {
		if locations, ok := location.([]interface{}); ok {
			for _, d := range locations {
				if locMap, ok := d.(map[string]interface{}); ok {
					lc := nginx.ProxyHostLocation{}
					if path, ok := locMap["path"]; ok {
						lc.Path = path.(string)
					}
					if proxyPass, ok := locMap["proxy_pass"]; ok {
						lc.ProxyPass = proxyPass.(string)
					}

					if properties, ok := locMap["properties"]; ok {
						if props, ok := properties.([]interface{}); ok {
							lp := []string{}
							for _, p := range props {
								lp = append(lp, p.(string))
							}
							lc.Properties = lp
						}
					}
					nl = append(nl, lc)
				}
			}
		}
	}
	return nl
}

// Generate a functions to save Data

func SetProxyHostStatus(db *gorm.DB, id string, status string, message string) error {
	if res := db.Model(&ProxyHost{}).Where("id = ?", id).Updates(ProxyHost{Status: status, Message: message}); res.Error != nil {
		return res.Error
	}
	return nil
}

func SetProxyHost(db *gorm.DB, id string, ph *ProxyHost) error {
	if res := db.Model(&ProxyHost{}).Where("id = ?", id).Updates(ph); res.Error != nil {
		return res.Error
	}
	return nil
}

func UpdateLocationByPath(db *gorm.DB, phID string, l nginx.ProxyHostLocation) (lcs []nginx.ProxyHostLocation, err error) {
	locations := []Location{}
	if err := db.Where("proxy_host_id = ?", phID).Preload("Properties").Find(&locations).Error; err != nil {
		return lcs, err
	}
	if len(locations) == 0 {
		lcs = append(lcs, l)
		if res := db.Create(&Location{Path: l.Path, ProxyPass: l.ProxyPass, ProxyHostID: phID}); res.Error != nil {
			return lcs, res.Error
		}
	}
	for i := 0; i < len(locations); i++ {
		if locations[i].Path == l.Path {
			lcs = append(lcs, nginx.ProxyHostLocation{
				ProxyPass:  l.ProxyPass,
				Path:       l.Path,
				Properties: l.Properties,
			})
			location := Location{}
			if res := db.Model(&Location{}).Where("proxy_host_id = ? AND path = ?", phID, l.Path).First(&location); res.Error != nil {
				return lcs, res.Error
			}
			if res := db.Model(&location).Where("id like ?", location.ID).Updates(&Location{ProxyPass: l.ProxyPass, Path: l.Path}); res.Error != nil {
				return lcs, res.Error
			}
			if res := db.Model(&LocationProperty{}).Where("location_id = ?", location.ID).Delete(&LocationProperty{}); res.Error != nil {
				return lcs, res.Error
			}
			for _, property := range l.Properties {
				if res := db.Model(&LocationProperty{}).Create(&LocationProperty{LocationID: location.ID, Property: property}); res.Error != nil {
					return lcs, res.Error
				}
			}
		} else {
			properties := []string{}
			for j := 0; j < len(locations[i].Properties); j++ {
				properties = append(properties, locations[i].Properties[j].Property)
			}
			lcs = append(lcs, nginx.ProxyHostLocation{ProxyPass: locations[i].ProxyPass, Path: locations[i].Path, Properties: properties})
		}
	}

	return lcs, nil
}

func UpdateDomainsByPath(db *gorm.DB, phID string, domains []string) ([]string, error) {
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
