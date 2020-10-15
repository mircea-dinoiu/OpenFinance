ALTER TABLE stocks
  ADD COLUMN currency_id INT UNSIGNED NOT NULL DEFAULT 1,
  ADD CONSTRAINT stocks_currency_id_foreign FOREIGN KEY (currency_id)
    REFERENCES currencies (id);
