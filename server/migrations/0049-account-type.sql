ALTER TABLE `money_locations` 
    MODIFY COLUMN `type` ENUM ('brokerage', 'cash', 'credit', 'loan') NOT NULL DEFAULT 'cash';