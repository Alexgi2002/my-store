-- Seed some initial products
INSERT INTO products (name, description, price, image_url, stock) VALUES
  ('Producto 1', 'Descripción del producto 1', 29.99, '/placeholder.svg?height=300&width=300', 10),
  ('Producto 2', 'Descripción del producto 2', 49.99, '/placeholder.svg?height=300&width=300', 15),
  ('Producto 3', 'Descripción del producto 3', 19.99, '/placeholder.svg?height=300&width=300', 20),
  ('Producto 4', 'Descripción del producto 4', 39.99, '/placeholder.svg?height=300&width=300', 12)
ON CONFLICT DO NOTHING;
