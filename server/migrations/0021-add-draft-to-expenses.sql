ALTER TABLE expenses MODIFY COLUMN status enum('finished', 'pending', 'draft') NOT NULL;
