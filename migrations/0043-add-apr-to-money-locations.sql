ALTER TABLE money_locations
ADD COLUMN credit_apr INT unsigned DEFAULT NULL;
ALTER TABLE money_locations MODIFY COLUMN `credit_apr` DECIMAL(4,2) DEFAULT NULL;
