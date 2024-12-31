package users

import (
	"math"

	"github.com/gofiber/fiber/v2"
	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/models"
	"github.com/izetmolla/proxymanager/utils"
)

func GetUsersList(c *fiber.Ctx) error {
	var total int64 = 0
	paginate := utils.GetPaginateParams(c.Query("pageIndex", "0"), c.Query("pageSize", "10"), c.Query("sortBy", "created_at.DESC"))
	query := c.Query("query", "")
	filterStatus := c.Query("filterData[status]", "") // Default to empty (no filtering)
	db := config.DB.Model(&models.User{})

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
	users := []models.User{}
	if res := db.
		Offset(paginate.Offset).
		Limit(paginate.PageSize).
		Order(paginate.SortBy + " " + paginate.SortOrder).
		Find(&users); res.Error != nil {
		return c.JSON(utils.Em(res.Error))
	}

	nn := make([]map[string]interface{}, len(users))
	for i := 0; i < len(users); i++ {
		nn[i] = map[string]interface{}{
			"id":         users[i].ID,
			"name":       users[i].Name,
			"username":   users[i].Username,
			"email":      users[i].Email,
			"status":     users[i].Status,
			"created_at": users[i].CreatedAt,
			"updated_at": users[i].UpdatedAt,
		}
	}

	return c.JSON(fiber.Map{
		"data":      nn,
		"rowCount":  total,
		"pageCount": int(math.Ceil(float64(total) / float64(paginate.PageSize))),
	})
}
