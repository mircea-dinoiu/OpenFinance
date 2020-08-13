ALTER TABLE expenses
  ADD COLUMN repeat_root_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT expenses__repeat_root_id__foreign
  FOREIGN KEY (repeat_root_id)
  REFERENCES expenses (id)
  ON DELETE CASCADE;

