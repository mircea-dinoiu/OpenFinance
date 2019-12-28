ALTER TABLE users
  ADD COLUMN preferred_money_location_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT users_preferred_money_location_id_foreign FOREIGN KEY (preferred_money_location_id)
    REFERENCES money_locations (id);
