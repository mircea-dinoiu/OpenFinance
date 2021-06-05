ALTER TABLE stocks ADD COLUMN pricing_method ENUM('manual','infer','exchange') DEFAULT 'exchange' NOT NULL;
UPDATE stocks set pricing_method = 'manual' where manual_pricing = 1;
