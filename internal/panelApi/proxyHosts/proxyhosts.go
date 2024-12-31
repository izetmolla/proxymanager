package proxyhosts

import (
	"fmt"
	"math"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/utils"
)

func GetProxyHosts(c *fiber.Ctx) error {
	var total int64 = 0
	paginate := utils.GetPaginateParams(c.Query("pageIndex", "0"), c.Query("pageSize", "10"), c.Query("sortBy", "created_at.DESC"))
	query := c.Query("query", "")
	filterStatus := c.Query("status", "") // Default to empty (no filtering)
	db := config.DB.Model(&models.ProxyHost{})

	// Apply status filter if provided
	if len(filterStatus) > 0 {
		db = db.Where("status = ?", filterStatus)
	}

	// Apply name filter if provided
	if len(query) > 0 {
		db = db.Where("name LIKE ?", "%"+query+"%")
	}

	// Get the total count before applying pagination
	db.Count(&total)
	nodes := []models.ProxyHost{}
	if res := db.
		Offset(paginate.Offset).
		Limit(paginate.PageSize).
		Order(paginate.SortBy + " " + paginate.SortOrder).
		Preload("Domains").
		// Preload("ProxyHostServer.Server").
		Find(&nodes); res.Error != nil {
		return c.JSON(utils.Em(res.Error))
	}

	nn := make([]map[string]interface{}, len(nodes))
	for i := 0; i < len(nodes); i++ {
		domains := make([]string, len(nodes[i].Domains))
		for j := 0; j < len(nodes[i].Domains); j++ {
			domains[j] = nodes[i].Domains[j].Name
		}
		nn[i] = map[string]interface{}{
			"id":      nodes[i].ID,
			"domains": domains,
			"status":  nodes[i].Status,
		}
	}

	return c.JSON(fiber.Map{
		"data":      nn,
		"rowCount":  total,
		"pageCount": int(math.Ceil(float64(total) / float64(paginate.PageSize))),
	})
}

type CreateProxyHostRequest struct {
	Domains   []string                  `json:"domains"`
	Locations []nginx.ProxyHostLocation `json:"locations"`
	EnableSSL bool                      `json:"enableSSL"`
}

func CreateProxyHost(c *fiber.Ctx) error {
	var body CreateProxyHostRequest
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}

	if err := models.IsDomainExistOnDB(config.DB, body.Domains); err != nil {
		return c.JSON(utils.Em(err))
	}

	ph, err := models.GetProxyHostitemByID(config.DB, "")
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	locations, err := models.UpdateLocationByPath(config.DB, ph.ID, body.Locations[0])
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	domains, err := models.UpdateDomainsByPath(config.DB, ph.ID, body.Domains)
	if err != nil {
		return err
	}

	if err = config.NGINX.UpdateProxyHost(&nginx.CreateNewProxyHostOptions{
		ID:         ph.ID,
		Domains:    domains,
		Locations:  locations,
		SSLEnabled: body.EnableSSL,
	}); err != nil {
		return c.JSON(utils.Em(err))
	}

	if err := models.SaveProxyHostItem(config.DB, ph.ID, domains, locations); err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{"id": ph.ID},
	})
}

func GetProxyHost(c *fiber.Ctx) error {
	id := c.Query("id")
	ph, err := models.GetProxyHostByID(config.DB, id)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if ph.ID == "" {
		return c.JSON(utils.Em(fmt.Errorf("proxy host not found")))
	}

	domains := make([]string, len(ph.Domains))
	for i := 0; i < len(ph.Domains); i++ {
		domains[i] = ph.Domains[i].Name
	}
	locations := make([]nginx.ProxyHostLocation, len(ph.Locations))
	for i := 0; i < len(ph.Locations); i++ {
		properties := make([]string, len(ph.Locations[i].Properties))
		for k, v := range ph.Locations[i].Properties {
			properties[k] = v.Property
		}
		locations[i] = nginx.ProxyHostLocation{
			Path:       ph.Locations[i].Path,
			ProxyPass:  ph.Locations[i].ProxyPass,
			Properties: properties,
		}
	}

	return c.JSON(fiber.Map{
		"data": fiber.Map{
			"id":        ph.ID,
			"domains":   domains,
			"locations": locations,
		},
	})
}

type SaveProxyHostOverviewRequest struct {
	ID        string                    `json:"id"`
	Domains   []string                  `json:"domains"`
	Protocol  string                    `json:"protocol"`
	Host      string                    `json:"host"`
	Locations []nginx.ProxyHostLocation `json:"locations"`
}

func SaveProxyHostOverview(c *fiber.Ctx) error {
	var body SaveProxyHostOverviewRequest
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(utils.Em(err))
	}
	ph, err := models.GetProxyHostByID(config.DB, body.ID)
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if ph.ID == "" {
		return c.JSON(utils.Em(fmt.Errorf("proxy host not found")))
	}
	if err := models.IsDomainExist(config.DB, ph.ID, body.Domains); err != nil {
		return c.JSON(utils.Emp(err, "domains"))
	}
	if len(body.Locations) == 0 {
		return c.JSON(utils.Emp(fmt.Errorf("locations must be provided"), "host"))
	}

	locations, err := models.UpdateLocationByPath(config.DB, ph.ID, body.Locations[0])
	if err != nil {
		return c.JSON(utils.Em(err))
	}

	domains, err := models.UpdateDomainsByPath(config.DB, ph.ID, body.Domains)
	if err != nil {
		return err
	}

	if err = config.NGINX.UpdateProxyHost(&nginx.CreateNewProxyHostOptions{
		ID:         ph.ID,
		Domains:    domains,
		Locations:  locations,
		SSLEnabled: true,
	}); err != nil {
		go models.SetProxyHostStatus(config.DB, ph.ID, "error", err.Error())
		return c.JSON(utils.Em(err))
	}
	go models.SetProxyHostStatus(config.DB, ph.ID, "running", "")
	return c.JSON(fiber.Map{})
}

func DeleteProxyHost(c *fiber.Ctx) error {
	ph, err := models.GetProxyHostByID(config.DB, c.Query("id", ""))
	if err != nil {
		return c.JSON(utils.Em(err))
	}
	if ph.ID == "" {
		return c.JSON(utils.Em(fmt.Errorf("proxy host not found")))
	}
	if err := config.NGINX.DeleteProxyHost(ph.ID); err != nil {
		return c.JSON(utils.Em(err))
	}

	if err := models.DeleteProxyHostItem(config.DB, ph.ID); err != nil {
		return c.JSON(utils.Em(err))
	}

	return c.JSON(fiber.Map{
		"data": ph,
	})
}
