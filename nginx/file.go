package nginx

import (
	"bufio"
	"embed"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"text/template"
)

func createNginxDirectories(cd string) error {
	if !existOnDisk(cd) {
		makeDirectories(cd)
		makeDirectories(
			filepath.Join(cd, "hosts"),
			filepath.Join(cd, "temlates"),
			filepath.Join(cd, "ssl"),
			filepath.Join(cd, "logs"),
			filepath.Join(cd, "options"),
			filepath.Join(cd, "custom"),
			filepath.Join(cd, "default_host"),
			filepath.Join(cd, "proxy_host"),
			filepath.Join(cd, "redirection_host"),
			filepath.Join(cd, "dead_host"),
			filepath.Join(cd, "temp"),
			filepath.Join(cd, "stream"),
		)
	}
	makeDirectories(
		"/var/www/html",
		"/tmp/nginx/body",
		"/var/logs/nginx",
		"/etc/nginx/ssl",
		"/var/lib/nginx/cache/public",
	)
	if _, err := checkOrCreateSystemFile(filepath.Join(cd, "main.conf")); err != nil {
		return err
	}
	return nil
}

// Create Directory for proxy host
func createProxyHostDirectories(folderPath string) string {
	if existOnDisk(folderPath) {
		return folderPath
	} else {
		_ = makeDirectories(folderPath, filepath.Join(folderPath, "config"))
		return folderPath
	}
}

// Create Directory for proxy host
func createProxyHostSslDirectories(folderPath string) string {
	if existOnDisk(folderPath) {
		return folderPath
	} else {
		_ = makeDirectories(folderPath)
		return folderPath
	}
}

// util functions for nginx based on file operations
func existOnDisk(files ...string) bool {
	_, errfileExist := os.Stat(filepath.Join(files...))
	return !os.IsNotExist(errfileExist)
}

func makeDirectories(arg ...string) error {
	for _, dirPath := range arg {
		if _, err := os.Stat(dirPath); os.IsNotExist(err) {
			if err := os.MkdirAll(dirPath, os.ModePerm); err != nil {
				fmt.Println("Error creating dir:", err.Error())
			}
		}
	}
	return nil
}

func deleteFolder(folder string) error {
	return os.RemoveAll(folder)
}

func checkOrCreateSystemFile(filepathName string) (string, error) {
	if !existOnDisk(filepathName) {
		err := os.MkdirAll(filepath.Dir(filepathName), os.ModePerm)
		if err != nil {
			return filepathName, err
		}
		file, err := os.Create(filepathName)
		if err != nil {
			return filepathName, err
		}
		defer file.Close()
	}
	return filepathName, nil
}

func copyFile(src, dst string) error {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return err
	}
	defer source.Close()

	destination, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destination.Close()
	_, err = io.Copy(destination, source)
	return err
}

func createFromBinary(src *embed.FS, sourceFilePath, destFilePath string, data any) error {
	srcFile, err := src.ReadFile(filepath.Join("materials", sourceFilePath))
	if err != nil {
		return err
	}
	t, err := template.New(fmt.Sprintf("file_%s", randomString(10))).Parse(string(srcFile))

	if err != nil {
		return err
	}

	f, err := os.Create(destFilePath)
	if err != nil {
		return err
	}

	err = t.Execute(f, data)
	if err != nil {
		return err
	}
	defer f.Close()
	return nil
}

func readBinaryFolder(src *embed.FS, folderPath string) ([]string, error) {
	var files []string
	folder, err := src.ReadDir(filepath.Join("materials", folderPath))
	if err != nil {
		return files, err
	}
	for _, file := range folder {
		files = append(files, file.Name())
	}
	return files, nil
}

func ReadFromFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	var content string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		content += scanner.Text() + "\n"
	}

	if err := scanner.Err(); err != nil {
		return "", err
	}

	return content, nil
}

func WriteToFile(filePath string, content string) error {
	if _, err := checkOrCreateSystemFile(filePath); err != nil {
		return err
	}
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	_, err = writer.WriteString(content)
	if err != nil {
		return err
	}

	return writer.Flush()
}
