ALTER TABLE incomes
  ADD COLUMN currency_id INT UNSIGNED NOT NULL DEFAULT 2,
  ADD CONSTRAINT incomes_currency_id_foreign FOREIGN KEY (currency_id)
    REFERENCES currencies (id);
