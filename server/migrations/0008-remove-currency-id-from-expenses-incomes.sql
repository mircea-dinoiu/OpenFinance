ALTER TABLE incomes DROP FOREIGN KEY incomes_currency_id_foreign;
ALTER TABLE incomes DROP COLUMN currency_id;
ALTER TABLE expenses DROP FOREIGN KEY expenses_currency_id_foreign;
ALTER TABLE expenses DROP COLUMN currency_id;
