START TRANSACTION;

ALTER TABLE `expenses` CHANGE `stock_units` `quantity` DECIMAL(19,10) NOT NULL DEFAULT 1;
update expenses set quantity = 1 where quantity = 0;
ALTER TABLE `expenses` CHANGE `sum` `price` FLOAT(8,2) NOT NULL;
ALTER TABLE expenses MODIFY COLUMN `price` DECIMAL(8,2) NOT NULL;

COMMIT;
