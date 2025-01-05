package nginx

import (
	"bufio"
	"bytes"
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func execAPP(name string, arg ...string) (string, error) {
	cmd := exec.Command(name, arg...)
	var outb, errb bytes.Buffer
	cmd.Stdout = &outb
	cmd.Stderr = &errb
	err := cmd.Run()
	if err != nil {
		if len(errb.String()) > 0 {
			return "", fmt.Errorf("%s - %s", err, errb.String())
		}
		return "", fmt.Errorf("error executing command: %s", err.Error())
	}
	res := strings.TrimSpace(fmt.Sprintf("%s %s", outb.String(), errb.String()))
	return res, nil
}

func ExecAPP(name string, arg ...string) (string, error) {
	return execAPP(name, arg...)
}

func insertLineToFile(fileName, line string) error {
	// Open the file in read mode to check for duplicates
	file, err := os.OpenFile(fileName, os.O_RDONLY, os.FileMode(ReadFilePermissionCode))
	if err != nil {
		return err
	}
	defer file.Close()

	// Create a scanner to read the file line by line
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		existingLine := scanner.Text()

		// Check if the line already exists in the file
		if existingLine == line {
			return nil
		}
	}

	// Open the file in append mode to add the new line
	file, err = os.OpenFile(fileName, os.O_APPEND|os.O_WRONLY, os.FileMode(ReadFilePermissionCode))
	if err != nil {
		return err
	}
	defer file.Close()

	// Write the new line to the file
	_, err = file.WriteString(line + "\n")
	if err != nil {
		return err
	}
	return nil
}

func removeLineFromFile(fileName, lineToRemove string) error {
	// Open the input file in read mode
	file, err := os.OpenFile(fileName, os.O_RDWR, os.FileMode(ReadFilePermissionCode))
	if err != nil {
		return err
	}
	defer file.Close()

	// Create a scanner to read the file line by line
	scanner := bufio.NewScanner(file)
	var lines []string

	// Read lines into a slice, excluding the line to be removed
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) != lineToRemove {
			lines = append(lines, line)
		}
	}

	// Truncate the file to remove its content
	err = file.Truncate(0)
	if err != nil {
		return err
	}

	// Seek to the beginning of the file
	_, err = file.Seek(0, 0)
	if err != nil {
		return err
	}

	// Write the updated lines back to the file
	writer := bufio.NewWriter(file)
	for _, line := range lines {
		_, errR := writer.WriteString(line + "\n")
		if errR != nil {
			return errR
		}
	}

	err = writer.Flush()
	if err != nil {
		return err
	}
	return nil
}

func mainFileLine(p string) string {
	return fmt.Sprintf("include %s/*.conf;", filepath.Join(p, "config"))
}

func setProxyPasConfigFile(fp, sslPath string, opt *CreateNewProxyHostOptions) (err error) {
	if err := createFromBinary(&Materials, "nginx_proxyhost.tpl", filepath.Join(fp, "config", "nginx.conf"), ProxyHost{
		ID:       opt.ID,
		HostPath: fp,
		ProxyHostSSL: ProxyHostSSL{
			Enabled:        opt.SSLEnabled,
			ForceHttps:     opt.ForceHttps,
			Certificate:    filepath.Join(opt.SSLType, "ssl.crt"),
			CertificateKey: filepath.Join(opt.SSLType, "ssl.key"),
			HTTP2:          opt.HTTP2,
			Hsts:           opt.Hsts,
		},
		Domains:   opt.Domains,
		Locations: opt.Locations,
		SslPath:   sslPath,
	}); err != nil {
		return err
	}
	return nil
}

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func FindProcessByName(name string) []int {
	cmd := exec.Command("pgrep", name) // Use 'pgrep' to find processes by name
	var out bytes.Buffer
	cmd.Stdout = &out

	if err := cmd.Run(); err != nil {
		return nil
	}

	// Parse PIDs from the output
	lines := strings.Split(strings.TrimSpace(out.String()), "\n")
	pids := []int{}
	for _, line := range lines {
		var pid int
		fmt.Sscanf(line, "%d", &pid)
		pids = append(pids, pid)
	}

	return pids
}

func KillProcess(pid int) error {
	proc, err := os.FindProcess(pid)
	if err != nil {
		return err
	}
	if err := proc.Signal(syscall.SIGKILL); err != nil {
		fmt.Printf("Failed to kill process with PID %d: %v\n", pid, err)
		return err
	}
	return nil
}

func setStringOnEmpty(current, newString string) string {
	if current == "" {
		return newString
	}
	return current
}

func setBoolOnEmpty(current, bewBool bool) bool {
	if !current {
		return bewBool
	}
	return current
}
