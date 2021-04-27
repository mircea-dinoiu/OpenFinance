ALTER TABLE expenses CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE FULLTEXT INDEX item_notes ON expenses(item, notes);
