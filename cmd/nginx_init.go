package cmd

import (
	"os"

	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/utils"
	"github.com/spf13/cobra"
)

func init() {
	nginxCmd.AddCommand(nginxInitCmd)
}

var nginxInitCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize nginx configuration",
	Long:  `Initialize a new nginx configuration to use with Load Balancer. All of this options can be changed in the future with the command 'flowtrove config set'. The user related flags apply to the defaults when creating new users and you don't override the options.`,
	Args:  cobra.NoArgs,
	Run: initApp(func(cmd *cobra.Command, _ []string, d initData) {
		nginx, err := config.InitNginx(&nginx.NginxInitOptions{
			ConfigPath:        "/etc/proxymanager/data",
			ConfigExtension:   "json",
			IsNginxConfigured: false,
		}, d.db)
		if err != nil {
			utils.PrintCLi("plain", "", err)
			os.Exit(1)
		}
		msg, err := nginx.Status()
		utils.PrintCLi("plain", msg, err)
		os.Exit(0)
	}),
}
