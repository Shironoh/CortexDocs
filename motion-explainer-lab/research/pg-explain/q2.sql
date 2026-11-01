\pset pager off
ALTER TABLE orders SET (autovacuum_enabled = false);
INSERT INTO orders (customer_id, status, total_cents, created_at)
SELECT 1 + floor(random() * 200000)::int, 'disputed', 500 + floor(random() * 20000)::int, timestamptz '2025-11-01' + random() * interval '30 days' FROM generate_series(1, 300000);
EXPLAIN (ANALYZE) SELECT c.city, count(*), sum(o.total_cents) FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'disputed' GROUP BY c.city;
