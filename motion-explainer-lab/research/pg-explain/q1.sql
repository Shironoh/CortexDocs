\pset pager off
EXPLAIN (ANALYZE) SELECT id, total_cents, created_at FROM orders WHERE customer_id = 4217 ORDER BY created_at DESC LIMIT 20;
