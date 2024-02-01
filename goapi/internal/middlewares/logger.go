package middlewares

import "net/http"

func Logger(next http.Handler) http.Handler {
	return next
}
