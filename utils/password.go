package utils

import "golang.org/x/crypto/bcrypt"

func CreatePassword(password string) string {
	cost := 12
	encpw, _ := bcrypt.GenerateFromPassword([]byte(password), cost)
	return string(encpw)
}

func IsValidPassword(encpw, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(encpw), []byte(pw)) == nil
}
