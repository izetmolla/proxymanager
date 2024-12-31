package cmd

import (
	"errors"
	"log"
	"strings"

	"github.com/izetmolla/proxymanager/config"
	"github.com/izetmolla/proxymanager/nginx"
	"github.com/izetmolla/proxymanager/routes"
	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	v "github.com/spf13/viper"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	cfgFile string
)

func init() {
	cobra.OnInitialize(initConfig)
	cobra.MousetrapHelpText = ""

	rootCmd.SetVersionTemplate("ProxyManager version {{printf \"%s\" .Version}}\n")

	flags := rootCmd.Flags()
	persistent := rootCmd.PersistentFlags()

	persistent.StringVarP(&cfgFile, "config", "c", "", "config file path")
	persistent.StringP("database", "d", "/etc/proxymanager/data/db/sqlite.db", "database path")
	// flags.Bool("noauth", false, "use the noauth auther when using quick setup")
	// flags.String("username", "admin", "username for the first user when using quick config")
	// flags.String("password", "", "hashed password for the first user when using quick config (default \"admin\")")

	addServerFlags(flags)
}

func addServerFlags(flags *pflag.FlagSet) {
	flags.StringP("address", "a", "127.0.0.1", "address to listen on")
	flags.StringP("log", "l", "stdout", "log output")
	flags.StringP("port", "p", "81", "port to listen on")
	flags.StringP("baseurl", "b", "", "base url")
	flags.String("access_token_exp", "1m", "Access Token session timeout")
	flags.String("refresh_token_exp", "8760h", "Refresh Token session timeout")
}

var rootCmd = &cobra.Command{
	Use:   "proxymanager",
	Short: "A stylish web-based ProxyManager",
	Long:  `ProxyManager is a stylish web-based application for managing proxy,loadbalancing and streaming using Nginx.`,
	Run: initApp(func(cmd *cobra.Command, _ []string, d initData) {
		_ = insertAdminUser(d.db)
		server := getRunParams(cmd.Flags(), d.db)
		adr := server.Address + ":" + server.Port
		app, err := routes.NewHandler(d.db, server)

		checkErr(err)
		if err := app.Listen(adr); err != nil {
			log.Fatal(err)
		}
	}),
}

type cobraFunc func(cmd *cobra.Command, args []string)
type pythonFunc func(cmd *cobra.Command, args []string, data initData)

type initData struct {
	db         *gorm.DB
	nginx      *nginx.Nginx
	configured bool
}

func initApp(fn pythonFunc) cobraFunc {
	return func(cmd *cobra.Command, args []string) {
		data := initData{configured: false}
		path, err := checkOrCreateSystemFile(getParam(cmd.Flags(), "database"))
		checkErr(err)
		data.db, err = config.InitDB(path, &gorm.Config{
			Logger: logger.Discard,
		})
		checkErr(err)
		lco, err := config.LoadConfig(data.db)
		checkErr(err)
		data.nginx, err = config.InitNginx(&nginx.NginxInitOptions{
			ConfigPath:        "/etc/proxymanager/data",
			LogsPath:          "/etc/proxymanager/logs",
			ConfigExtension:   "json",
			IsNginxConfigured: config.IsNginxConfigured(data.db),
			MainFileDB:        lco.MainFileDB,
		}, data.db)
		checkErr(err)
		fn(cmd, args, data)
	}
}

func getParam(flags *pflag.FlagSet, key string) string {
	val, _ := getParamB(flags, key)
	return val
}
func getParamB(flags *pflag.FlagSet, key string) (string, bool) {
	value, _ := flags.GetString(key)

	// If set on Flags, use it.
	if flags.Changed(key) {
		return value, true
	}

	// If set through viper (env, config), return it.
	if v.IsSet(key) {
		return v.GetString(key), true
	}

	// Otherwise use default value on flags.
	return value, false
}

func initConfig() {
	if cfgFile == "" {
		home, err := homedir.Dir()
		checkErr(err)
		v.AddConfigPath(".")
		v.AddConfigPath(home)
		v.AddConfigPath("/etc/proxymanager/")
		v.SetConfigName(".proxymanager")
	} else {
		v.SetConfigFile(cfgFile)
	}

	v.SetEnvPrefix("FB")
	v.AutomaticEnv()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := v.ReadInConfig(); err != nil {
		var configParseError v.ConfigParseError
		if errors.As(err, &configParseError) {
			panic(err)
		}
		cfgFile = "No config file used"
	} else {
		cfgFile = "Using config file: " + v.ConfigFileUsed()
	}
}
