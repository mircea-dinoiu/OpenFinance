create table properties
(
	id int unsigned auto_increment primary key,
    name varchar(255) not null,
    cost DECIMAL(8,2) not null,
    market_value DECIMAL(8,2) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    deleted_at timestamp null default null,
    currency_id int unsigned not null,
    project_id int unsigned not null,
    constraint properties__currency_id__foreign foreign key (currency_id) references currencies (id),
    constraint properties__project_id__foreign foreign key (project_id) references projects (id)
);
