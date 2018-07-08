'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(`
create table categories
(
	id int unsigned auto_increment
		primary key,
	name varchar(50) not null charset utf8mb4,
	created_at timestamp default '0000-00-00 00:00:00' not null,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	constraint categories_name_unique
		unique (name)
)
engine=InnoDB
;

create table category_expense
(
	category_id int unsigned not null,
	expense_id int unsigned not null,
	constraint category_expense_category_id_expense_id_unique
		unique (category_id, expense_id),
	constraint category_expense_category_id_foreign
		foreign key (category_id) references categories (id)
			on delete cascade
)
engine=InnoDB
;

create index category_expense_category_id_foreign
	on category_expense (category_id)
;

create index category_expense_expense_id_foreign
	on category_expense (expense_id)
;

create table currencies
(
	id int unsigned auto_increment
		primary key,
	iso_code varchar(255) not null,
	currency varchar(255) not null,
	symbol varchar(255) not null,
	constraint currencies_iso_code_unique
		unique (iso_code)
)
engine=InnoDB
;

create table expense_user
(
	user_id int unsigned not null,
	expense_id int unsigned not null,
	blame tinyint(1) default '0' not null,
	seen tinyint(1) default '0' not null,
	constraint expense_user_expense_id_user_id_unique
		unique (expense_id, user_id)
)
engine=InnoDB
;

create index expense_user_user_id_foreign
	on expense_user (user_id)
;

create index expense_user_expense_id_foreign
	on expense_user (expense_id)
;

create table expenses
(
	id int unsigned auto_increment
		primary key,
	sum float(8,2) not null,
	item text not null charset utf8mb4,
	created_at timestamp default '0000-00-00 00:00:00' not null,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	status enum('finished', 'pending') not null,
	currency_id int unsigned not null,
	money_location_id int unsigned null,
	\`repeat\` enum('d', 'w', 'm', 'y') null,
	constraint expenses_currency_id_foreign
		foreign key (currency_id) references currencies (id)
)
engine=InnoDB
;

create index expenses_currency_id_foreign
	on expenses (currency_id)
;

create index expenses_money_location_id_foreign
	on expenses (money_location_id)
;

alter table category_expense
	add constraint category_expense_expense_id_foreign
		foreign key (expense_id) references expenses (id)
			on delete cascade
;

alter table expense_user
	add constraint expense_user_expense_id_foreign
		foreign key (expense_id) references expenses (id)
			on delete cascade
;

create table incomes
(
	id int unsigned auto_increment
		primary key,
	sum float(8,2) not null,
	description text not null,
	user_id int unsigned not null,
	created_at timestamp default '0000-00-00 00:00:00' not null,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	money_location_id int unsigned null,
	\`repeat\` enum('d', 'w', 'm', 'y') null,
	status enum('finished', 'pending') default 'finished' not null
)
engine=InnoDB
;

create index incomes_user_id_foreign
	on incomes (user_id)
;

create index incomes_money_location_id_foreign
	on incomes (money_location_id)
;

create table migrations
(
	migration varchar(255) not null,
	batch int not null
)
engine=InnoDB
;

create table money_location_types
(
	id int unsigned auto_increment
		primary key,
	name varchar(255) not null,
	constraint money_location_types_name_unique
		unique (name)
)
engine=InnoDB collate=utf8_unicode_ci
;

create table money_locations
(
	id int unsigned auto_increment
		primary key,
	name varchar(255) not null,
	type_id int unsigned null,
	constraint money_locations_name_unique
		unique (name),
	constraint money_locations_type_id_foreign
		foreign key (type_id) references money_location_types (id)
)
engine=InnoDB collate=utf8_unicode_ci
;

create index money_locations_type_id_foreign
	on money_locations (type_id)
;

alter table expenses
	add constraint expenses_money_location_id_foreign
		foreign key (money_location_id) references money_locations (id)
;

alter table incomes
	add constraint incomes_money_location_id_foreign
		foreign key (money_location_id) references money_locations (id)
;

create table sequelizemeta
(
	name varchar(255) not null
		primary key,
	constraint SequelizeMeta_name_unique
		unique (name),
	constraint name
		unique (name)
)
engine=InnoDB collate=utf8_unicode_ci
;

create table sessions
(
	sid varchar(32) not null
		primary key,
	expires datetime null,
	data text null,
	createdAt datetime not null,
	updatedAt datetime not null
)
engine=InnoDB charset=latin1
;

create table settings
(
	id int unsigned auto_increment
		primary key,
	\`key\` varchar(255) not null,
	value varchar(255) not null,
	created_at timestamp default '0000-00-00 00:00:00' not null,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	constraint settings_key_unique
		unique (\`key\`)
)
engine=InnoDB
;

create table users
(
	id int unsigned auto_increment
		primary key,
	email varchar(255) not null,
	password varchar(255) not null,
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	remember_token varchar(100) null,
	created_at timestamp default '0000-00-00 00:00:00' not null,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	deleted_at timestamp null,
	constraint users_email_unique
		unique (email)
)
engine=InnoDB
;

alter table expense_user
	add constraint expense_user_user_id_foreign
		foreign key (user_id) references users (id)
;

alter table incomes
	add constraint incomes_user_id_foreign
		foreign key (user_id) references users (id)
;


    `);
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    },

    down: () => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    },
};
