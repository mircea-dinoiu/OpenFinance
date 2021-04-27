ALTER TABLE `expenses` ADD COLUMN `type` enum('deposit', 'withdrawal') DEFAULT 'withdrawal';
