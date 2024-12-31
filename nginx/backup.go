package nginx

import (
	"os"
	"path/filepath"
)

func backupProxyHostCurrentConfig(pp string) (err error) {
	fp := filepath.Join(pp, "config")
	if existOnDisk(filepath.Join(fp, "nginx.conf")) {
		err = copyFile(filepath.Join(fp, "nginx.conf"), filepath.Join(fp, "nginx.back"))
	}
	return err
}

func restoreProxyHostCurrentConfig(pp string) (err error) {
	fp := filepath.Join(pp, "config")
	if existOnDisk(filepath.Join(fp, "nginx.back")) {
		err = copyFile(filepath.Join(fp, "nginx.back"), filepath.Join(fp, "nginx.conf"))
	}
	if err == nil {
		err = removeProxyHostBackupConfig(pp)
	}
	return err
}

func removeProxyHostBackupConfig(pp string) (err error) {
	fp := filepath.Join(pp, "config")
	if existOnDisk(filepath.Join(fp, "nginx.back")) {
		err = os.Remove(filepath.Join(fp, "nginx.back"))
	}
	return err
}
