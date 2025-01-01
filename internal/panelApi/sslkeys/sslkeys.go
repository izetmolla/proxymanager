package sslkeys

import (
	"math"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/utils"
)

func GetSslKeysList(c *fiber.Ctx) error {
	var total int64 = 0
	paginate := utils.GetPaginateParams(c.Query("pageIndex", "0"), c.Query("pageSize", "10"), c.Query("sortBy", "created_at.DESC"))
	query := c.Query("query", "")
	filterStatus := c.Query("status", "") // Default to empty (no filtering)
	db := config.DB.Model(&models.SslKey{})

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
	sslkeys := []models.SslKey{}
	if res := db.
		Offset(paginate.Offset).
		Limit(paginate.PageSize).
		Order(paginate.SortBy + " " + paginate.SortOrder).
		Preload("ProxyHosts").
		Find(&sslkeys); res.Error != nil {
		return c.JSON(utils.Em(res.Error))
	}

	nn := make([]map[string]interface{}, len(sslkeys))
	for i := 0; i < len(sslkeys); i++ {
		nn[i] = map[string]interface{}{
			"id":   sslkeys[i].ID,
			"name": sslkeys[i].Name,
			"type": sslkeys[i].Type,
		}
	}

	return c.JSON(fiber.Map{
		"data":      nn,
		"rowCount":  total,
		"pageCount": int(math.Ceil(float64(total) / float64(paginate.PageSize))),
	})
}
