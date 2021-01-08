ALTER TABLE stocks ADD type ENUM('etf','mf','stock', 'custom') DEFAULT 'stock' NOT NULL;
