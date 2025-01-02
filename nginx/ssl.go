package nginx

import "fmt"

const (
	baseAccountsRootFolderName = "accounts"
	baseKeysFolderName         = "keys"
	accountFileName            = "account.json"
	sslMaxRandomInt            = 128
	rpk                        = "RSA PRIVATE KEY"
	epk                        = "EC PRIVATE KEY"
)

func checkForSelfSSL(fps, domain string) bool {
	return existOnDisk(fps, "ssl", "auto", fmt.Sprintf("%s.crt", domain))
}

func GenerateSelfSSL(domain, fp, org string) error {
	return generateSelfSSL(domain, fp, org)
}
