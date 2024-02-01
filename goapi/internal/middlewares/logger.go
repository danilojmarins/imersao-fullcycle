package middlewares

import (
	"fmt"
	"net/http"
	"time"
)

type ResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func NewResponseWriter(w http.ResponseWriter) *ResponseWriter {
	return &ResponseWriter{w, http.StatusOK}
}

func (rw *ResponseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			rw := NewResponseWriter(w)
			start := time.Now()
			next.ServeHTTP(rw, r)
			fmt.Println("status:", rw.statusCode, "duration:", time.Since(start), "method:", r.Method, "path:", r.URL.EscapedPath())
		},
	)
}
