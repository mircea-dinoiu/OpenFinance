ALTER TABLE money_locations
  ADD COLUMN owner_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT money_locations__owner_id__foreign
  FOREIGN KEY (owner_id)
  REFERENCES users (id)
  ON DELETE CASCADE;

