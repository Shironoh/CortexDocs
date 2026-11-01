-- Jeu de données reproductible pour l'épisode « Lire un EXPLAIN ANALYZE » (PostgreSQL 18)
DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS customers;
SELECT setseed(0.42);
CREATE TABLE customers (id int PRIMARY KEY, name text, city text);
INSERT INTO customers SELECT g, 'client ' || g, (ARRAY['Lyon','Paris','Lille','Nantes','Brest'])[1 + g % 5] FROM generate_series(1, 200000) g;
CREATE TABLE orders (id bigserial PRIMARY KEY, customer_id int NOT NULL REFERENCES customers(id), status text NOT NULL,
  total_cents int NOT NULL, created_at timestamptz NOT NULL);
INSERT INTO orders (customer_id, status, total_cents, created_at)
SELECT 1 + floor(random() * 200000)::int, (ARRAY['paid','paid','paid','shipped','refunded'])[1 + floor(random() * 5)::int],
       500 + floor(random() * 20000)::int, timestamptz '2024-01-01' + random() * interval '700 days'
FROM generate_series(1, 2000000);
VACUUM ANALYZE customers; VACUUM ANALYZE orders;
