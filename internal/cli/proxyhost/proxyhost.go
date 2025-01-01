package proxyhost

import (
	"fmt"

	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/utils"
	"gorm.io/gorm"
)

func Update(db *gorm.DB, ng *nginx.Nginx, args []string) (string, error) {
	ph := models.ProxyHost{}
	if !utils.IsValidJOSON(args[0]) {
		return "", fmt.Errorf("invalid JSON")
	}
	ct := utils.StringToMAP(args)
	if id, ok := ct["id"]; ok {
		ph.ID = id.(string)
	}
	ph, err := models.GetProxyHostitemByID(db, ph.ID, "")
	if err != nil {
		return "", err
	}

	elements := ph.FormatElements(ph.ID, ct)

	if err := models.IsDomainExist(db, ph.ID, elements.Domains); err != nil {
		return "", err
	}

	err = ng.UpdateProxyHost(&nginx.CreateNewProxyHostOptions{
		ID:        ph.ID,
		Domains:   elements.Domains,
		Locations: elements.Locations,
	})
	if err != nil {
		return "", fmt.Errorf("failed to update proxy host: %v", err)
	}

	if err := models.SaveProxyHostItem(db, ph.ID, elements.Domains, elements.Locations); err != nil {
		return "", fmt.Errorf("failed to update proxy host: %v", err)
	}

	return "Proxy host updated successfully", nil
}
