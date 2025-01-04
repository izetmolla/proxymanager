package auth

import (
	"bytes"
	"compress/gzip"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/markbates/goth"
)

// Session can/should be set by applications using gothic. The default is a cookie store.
var (
	SessionStore  *session.Store
	ErrSessionNil = errors.New("goth/gothic: no SESSION_SECRET environment variable is set. The default cookie store is not available and any calls will fail. Ignore this warning if you are using a different store")
)

type key int

const ProviderParamKey key = iota

func CallBack(c *fiber.Ctx) error {
	return c.SendString("Hello, CallBack 👋!")
}

func Logout(c *fiber.Ctx) error {
	return c.SendString("Hello, Logout 👋!")
}

func Provider(c *fiber.Ctx) error {
	url, err := GetAuthURL(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	return c.Redirect(url, fiber.StatusTemporaryRedirect)
}

/*
GetAuthURL starts the authentication process with the requested provided.
It will return a URL that should be used to send users to.

It expects to be able to get the name of the provider from the query parameters
as either "provider" or ":provider".

I would recommend using the BeginAuthHandler instead of doing all of these steps
yourself, but that's entirely up to you.
*/
func GetAuthURL(ctx *fiber.Ctx) (string, error) {
	if SessionStore == nil {
		return "", ErrSessionNil
	}

	providerName, err := GetProviderName(ctx)
	if err != nil {
		return "", err
	}

	provider, err := goth.GetProvider(providerName)
	if err != nil {
		return "", err
	}

	sess, err := provider.BeginAuth(SetState(ctx))
	if err != nil {
		return "", err
	}

	url, err := sess.GetAuthURL()
	if err != nil {
		return "", err
	}

	err = StoreInSession(providerName, sess.Marshal(), ctx)
	if err != nil {
		return "", err
	}

	return url, err
}

// StoreInSession stores a specified key/value pair in the session.
func StoreInSession(key string, value string, ctx *fiber.Ctx) error {
	session, err := SessionStore.Get(ctx)
	if err != nil {
		return err
	}

	if err := updateSessionValue(session, key, value); err != nil {
		return err
	}

	// saved here
	session.Save()
	return nil
}

func updateSessionValue(session *session.Session, key, value string) error {
	var b bytes.Buffer
	gz := gzip.NewWriter(&b)
	if _, err := gz.Write([]byte(value)); err != nil {
		return err
	}
	if err := gz.Flush(); err != nil {
		return err
	}
	if err := gz.Close(); err != nil {
		return err
	}

	session.Set(key, b.String())

	return nil
}

// GetProviderName is a function used to get the name of a provider
// for a given request. By default, this provider is fetched from
// the URL query string. If you provide it in a different way,
// assign your own function to this variable that returns the provider
// name for your request.
func GetProviderName(ctx *fiber.Ctx) (string, error) {
	// try to get it from the url param "provider"
	if p := ctx.Query("provider"); p != "" {
		return p, nil
	}

	// try to get it from the url param ":provider"
	if p := ctx.Params("provider"); p != "" {
		return p, nil
	}

	//  try to get it from the Fasthttp context's value of "provider" key
	if p := ctx.Get("provider", ""); p != "" {
		return p, nil
	}

	// try to get it from the Fasthttp context's value of providerContextKey key
	if p := ctx.Get(fmt.Sprint(ProviderParamKey), ""); p != "" {
		return p, nil
	}

	// As a fallback, loop over the used providers, if we already have a valid session for any provider (ie. user has already begun authentication with a provider), then return that provider name
	providers := goth.GetProviders()
	session, err := SessionStore.Get(ctx)
	if err != nil {
		return "", err
		// or panic?
	}

	for _, provider := range providers {
		p := provider.Name()
		value := session.Get(p)
		if _, ok := value.(string); ok {
			return p, nil
		}
	}

	// if not found then return an empty string with the corresponding error
	return "", errors.New("you must select a provider")
}

// SetState sets the state string associated with the given request.
// If no state string is associated with the request, one will be generated.
// This state is sent to the provider and can be retrieved during the
// callback.
func SetState(ctx *fiber.Ctx) string {
	state := ctx.Query("state")
	if len(state) > 0 {
		return state
	}

	// If a state query param is not passed in, generate a random
	// base64-encoded nonce so that the state on the auth URL
	// is unguessable, preventing CSRF attacks, as described in
	//
	// https://auth0.com/docs/protocols/oauth2/oauth-state#keep-reading
	nonceBytes := make([]byte, 64)
	_, err := io.ReadFull(rand.Reader, nonceBytes)
	if err != nil {
		panic("gothic: source of randomness unavailable: " + err.Error())
	}
	return base64.URLEncoding.EncodeToString(nonceBytes)
}

// GetState gets the state returned by the provider during the callback.
// This is used to prevent CSRF attacks, see
// http://tools.ietf.org/html/rfc6749#section-10.12
func GetState(ctx *fiber.Ctx) string {
	return ctx.Query("state")
}
