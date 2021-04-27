ALTER TABLE `stocks` MODIFY COLUMN `type` ENUM('etf','mf','stock', 'custom', 'crypto') DEFAULT 'stock' NOT NULL;
