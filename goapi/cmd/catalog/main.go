package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/danilojmarins/imersao-fullcycle/goapi/internal/database"
	"github.com/danilojmarins/imersao-fullcycle/goapi/internal/middlewares"
	"github.com/danilojmarins/imersao-fullcycle/goapi/internal/service"
	"github.com/danilojmarins/imersao-fullcycle/goapi/internal/webserver"
	"github.com/go-chi/chi/v5"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(localhost:3306)/imersao-fullcycle")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	categoryDB := database.NewCategoryDB(db)
	categoryService := service.NewCategoryService(*categoryDB)
	webCategoryHandler := webserver.NewWebCategoryHandler(categoryService)

	productDB := database.NewProductDB(db)
	productService := service.NewProductService(*productDB)
	webProductHandler := webserver.NewWebProductHandler(productService)

	router := chi.NewRouter()

	router.Use(middlewares.Logger)
	router.Use(middlewares.Recover)

	router.Get("/category", webCategoryHandler.GetCategories)
	router.Get("/category/{id}", webCategoryHandler.GetCategoryById)
	router.Post("/category", webCategoryHandler.CreateCategory)

	router.Get("/product", webProductHandler.GetProducts)
	router.Get("/product/{id}", webProductHandler.GetProductById)
	router.Get("/product/category/{category_id}", webProductHandler.GetProductByCategoryId)
	router.Post("/product", webProductHandler.CreateProduct)

	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", router)
}
