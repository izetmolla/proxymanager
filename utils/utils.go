package utils

import (
	"bufio"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func IsValidJOSON(jsonStr string) bool {
	var js map[string]interface{}
	return json.Unmarshal([]byte(jsonStr), &js) == nil
}

func StringToMAP(args []string) map[string]interface{} {
	var js map[string]interface{}
	json.Unmarshal([]byte(args[0]), &js)
	return js
}

type PaginationParams struct {
	PageIndex int `json:"pageIndex"`
	PageSize  int `json:"pageSize"`
	Offset    int `json:"offset"`
	SortBy    string
	SortOrder string
}

func GetPaginateParams(page string, limit, sortBy string) PaginationParams {
	sb := strings.Split(sortBy, ".")
	if len(sb) < 2 {
		sb = append(sb, "DESC")
	}
	if sb[1] != "ASC" && sb[1] != "DESC" && sb[1] != "desc" && sb[1] != "asc" {
		sb[1] = "DESC"
	}
	p, _ := strconv.Atoi(page)
	l, _ := strconv.Atoi(limit)
	o := p * l
	return PaginationParams{PageIndex: p, PageSize: l, Offset: o, SortBy: sb[0], SortOrder: sb[1]}
}

func FetchNginxStatus() (string, error) {
	// Fetch data from the Nginx stub_status endpoint
	resp, err := http.Get("http://127.0.0.1:8088/nginx_status")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read the response and return as a string
	var sb strings.Builder
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		sb.WriteString(scanner.Text() + "\n")
	}
	return sb.String(), scanner.Err()
}
