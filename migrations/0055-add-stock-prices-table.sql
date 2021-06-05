create table stock_prices
(
    stock_id INT UNSIGNED NOT NULL,
    dated DATE NOT NULL,
    price DECIMAL(19,10) NOT NULL,
    constraint stock_prices__stock_id__dated__unique unique (stock_id, dated),
    constraint stock_prices__stock_id__foreign
        foreign key (stock_id) references stocks (id)
			on delete cascade
);
