\pset pager off
BEGIN;
EXPLAIN (ANALYZE) UPDATE orders SET status = 'refunded' WHERE customer_id = 4217;
ROLLBACK;
