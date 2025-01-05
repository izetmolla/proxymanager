package nginx

import (
	"fmt"
	"path/filepath"
	"strings"
)

func (ng *Nginx) Status() (string, error) {
	if res, err := execAPP("nginx", "-t"); err != nil {
		return res, err
	} else {
		if strings.Contains(res, "[warn]") || strings.Contains(res, "[alert]") || strings.Contains(res, "[emerg]") {
			return "", fmt.Errorf("%s", res)
		}
		return res, nil
	}
}

func (ng *Nginx) CheckAndUpdate(hostID string, options *CreateNewProxyHostOptions) (err error) {
	hp := filepath.Join(ng.ConfigPath, "hosts", hostID)
	if err := insertLineToFile(ng.MainFilePath, mainFileLine(hp)); err != nil {
		return err
	}
	if _, err := ng.Status(); err != nil {
		restoreErr := restoreProxyHostCurrentConfig(filepath.Join(hp, hostID))
		if restoreErr != nil {
			return restoreErr
		}
		_ = removeProxyHostBackupConfig(hp)
		if !options.NoReload {
			_, errNewReload := ng.Reload()
			if errNewReload != nil {
				if errRemoveLine := removeLineFromFile(ng.MainFilePath, mainFileLine(hp)); errRemoveLine != nil {
					_, _ = ng.Reload()
				}
			}
		}
		return nil
	} else {
		if !options.NoReload {

			if message, err := ng.Reload(); err != nil {
				return fmt.Errorf("%s %s", err.Error(), message)
			}
		}
		// if https && le != nil && ssl.IsLetEncryptExpired(filepath.Join(hp, fmt.Sprintf("config.%s", ng.ConfigExtension))) {
		// 	go generateLESSL(hostID, dm, ng, le)
		// }
		return nil
	}
}

func (ng *Nginx) Reload() (msg string, err error) {
	msg, err = execAPP("nginx", "-t")
	if err != nil {
		return msg, err
	}
	msg, err = execAPP("nginx", "-s", "reload", "-c", NginxMainFie)
	if err != nil {
		return msg, err
	}
	return msg, nil
}
