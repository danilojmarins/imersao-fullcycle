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
			date := start.Format("02/01/2006 - 03:04:05")
			next.ServeHTTP(rw, r)
			fmt.Printf("[%s] %s %s -> %d [%v]\n", date, r.Method, r.URL.EscapedPath(), rw.statusCode, time.Since(start))
		},
	)
}
