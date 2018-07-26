DROP DATABASE IF EXISTS bamazon ;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(100) NOT NULL,
 department_name VARCHAR(100) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 stock_quantity INT(10) NULL,
 PRIMARY KEY (item_id)
);

select * from products;

