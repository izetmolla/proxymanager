package cmd

import (
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(nginxCmd)
}

var nginxCmd = &cobra.Command{
	Use:   "nginx",
	Short: "Nginx management utility",
	Long:  `From here you can configure Nginx and its settings.`,
	Args:  cobra.NoArgs,
}
