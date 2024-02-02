CREATE TABLE IF NOT EXISTS categories (
    id varchar(36) NOT NULL,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products (
    id varchar(36) NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price decimal(10,2) NOT NULL,
    category_id varchar(36) NOT NULL,
    image_url varchar(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(id)
);