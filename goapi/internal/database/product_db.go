package database

import (
	"database/sql"

	"github.com/danilojmarins/imersao-fullcycle/goapi/internal/entity"
)

type ProductDB struct {
	db *sql.DB
}

func NewProductDB(db *sql.DB) *ProductDB {
	return &ProductDB{db: db}
}

func (cd *ProductDB) GetProducts() ([]*entity.Product, error) {
	rows, err := cd.db.Query("SELECT id, name, description, price, category_id, image_url FROM products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*entity.Product
	for rows.Next() {
		var product entity.Product
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.CategoryID, &product.ImageURL); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (cd *ProductDB) GetProductById(id string) (*entity.Product, error) {
	var product entity.Product
	err := cd.db.QueryRow("SELECT id, name, description, price, category_id, image_url FROM products WHERE id = ?", id).Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.CategoryID, &product.ImageURL)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (cd *ProductDB) CreateProduct(product *entity.Product) (string, error) {
	_, err := cd.db.Exec("INSERT INTO products (id, name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)", product.ID, product.Name, product.Description, product.Price, product.CategoryID, product.ImageURL)
	if err != nil {
		return "", err
	}
	return product.ID, nil
}
