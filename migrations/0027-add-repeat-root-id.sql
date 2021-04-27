ALTER TABLE expenses
  ADD COLUMN repeat_link_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT expenses__repeat_link_id__foreign
  FOREIGN KEY (repeat_link_id)
  REFERENCES expenses (id)
  ON DELETE CASCADE;

