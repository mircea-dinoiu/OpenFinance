ALTER TABLE money_locations ADD COLUMN status enum('closed', 'locked', 'open') not null DEFAULT 'open';
