\pset pager off
CREATE INDEX orders_customer_created_idx ON orders (customer_id, created_at DESC);
EXPLAIN (ANALYZE) SELECT id, total_cents, created_at FROM orders WHERE customer_id = 4217 ORDER BY created_at DESC LIMIT 20;
