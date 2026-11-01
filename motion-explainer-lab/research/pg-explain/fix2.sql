\pset pager off
ANALYZE orders;
EXPLAIN (ANALYZE) SELECT c.city, count(*), sum(o.total_cents) FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'disputed' GROUP BY c.city;
