START TRANSACTION;

create table stocks
(
	id int unsigned auto_increment
		primary key,
	symbol varchar(255) not null,
	price FLOAT NOT NULL,
	constraint stocks_symbol_unique
		unique (symbol)
)
engine=InnoDB
;

ALTER TABLE expenses ADD COLUMN stock_units FLOAT NOT NULL DEFAULT 0;
ALTER TABLE expenses ADD COLUMN stock_id int unsigned DEFAULT NULL;
ALTER TABLE expenses ADD constraint expenses_stock_id_foreign
                         foreign key (stock_id) references stocks (id);


COMMIT;
