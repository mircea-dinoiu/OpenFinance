ALTER TABLE money_locations ADD COLUMN type ENUM ('brokerage', 'cash', 'credit') NOT NULL DEFAULT 'cash';
ALTER TABLE money_locations DROP FOREIGN KEY money_locations_type_id_foreign;
ALTER TABLE money_locations DROP COLUMN type_id;
DROP TABLE money_location_types;
