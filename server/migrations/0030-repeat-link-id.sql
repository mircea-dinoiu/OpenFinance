ALTER TABLE expenses
    DROP FOREIGN KEY expenses__repeat_link_id__foreign;
ALTER TABLE expenses
    ADD CONSTRAINT expenses__repeat_link_id__foreign
    FOREIGN KEY (repeat_link_id)
    REFERENCES expenses (id)
    ON DELETE SET NULL;
