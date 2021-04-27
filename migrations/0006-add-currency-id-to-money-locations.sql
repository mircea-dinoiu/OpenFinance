ALTER TABLE money_locations
  ADD COLUMN currency_id int unsigned not null;
ALTER TABLE money_locations
  ADD constraint money_locations_currency_id_foreign
    foreign key (currency_id) references currencies (id);
