package nginx

import (
	"crypto"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
	"path/filepath"
	"time"

	"github.com/go-acme/lego/v4/certcrypto"
)

func generateSelfSSL(domain, fp, org string) error {
	p := filepath.Join(fp, "auto")
	makeDirectories(p)
	return generateSelfSignedSSL(
		filepath.Join(p, fmt.Sprintf("%s.key", domain)),
		filepath.Join(p, fmt.Sprintf("%s.crt", domain)),
		domain,
		org,
		certcrypto.RSA2048,
	)
}

func generateSelfSignedSSL(privateKeyFile, certificateFile, domain, org string, keyType certcrypto.KeyType) error {
	privateKey, err := generatePrivateKey(privateKeyFile, keyType) // Adjust key type as needed
	if err != nil {
		return err
	}

	serialNumber, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), sslMaxRandomInt))
	if err != nil {
		return err
	}

	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			Organization: []string{org},
		},
		NotBefore:             time.Now(),
		NotAfter:              time.Now().AddDate(1, 0, 0), // Valid for 1 year
		SubjectKeyId:          []byte{1, 2, 3, 4, 6},
		BasicConstraintsValid: true,
		IsCA:                  true,
		DNSNames:              []string{domain},
	}

	publicKey := privateKey.(crypto.Signer).Public()
	certificateBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, publicKey, privateKey)
	if err != nil {
		return err
	}
	certificateOut, err := os.Create(certificateFile)
	if err != nil {
		return err
	}
	defer certificateOut.Close()

	_ = pem.Encode(certificateOut, &pem.Block{Type: "CERTIFICATE", Bytes: certificateBytes})

	return nil
}
func generatePrivateKey(file string, keyType certcrypto.KeyType) (crypto.PrivateKey, error) {
	privateKey, err := certcrypto.GeneratePrivateKey(keyType)
	if err != nil {
		return nil, err
	}

	certOut, err := os.Create(file)
	if err != nil {
		return nil, err
	}
	defer certOut.Close()

	pemKey := certcrypto.PEMBlock(privateKey)
	err = pem.Encode(certOut, pemKey)
	if err != nil {
		return nil, err
	}

	return privateKey, nil
}
