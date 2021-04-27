START TRANSACTION;

create table projects
(
	id int unsigned auto_increment
		primary key,
    name varchar(255) not null,
    default_currency_id int unsigned not null,
    	constraint projects_default_currency_id_foreign
    		foreign key (default_currency_id) references currencies (id)
);

create table project_user
(
    user_id int unsigned not null,
    project_id int unsigned not null,
    constraint expense_user_project_id_user_id_unique
    		unique (project_id, user_id)
);

ALTER TABLE users DROP FOREIGN KEY users_preferred_money_location_id_foreign;
ALTER TABLE users DROP COLUMN preferred_money_location_id;

ALTER TABLE expenses
  ADD COLUMN project_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT expenses_project_id_foreign FOREIGN KEY (project_id)
    REFERENCES projects (id);

ALTER TABLE categories
  ADD COLUMN project_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT categories_project_id_foreign FOREIGN KEY (project_id)
    REFERENCES projects (id);

ALTER TABLE money_locations
  ADD COLUMN project_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT money_locations_project_id_foreign FOREIGN KEY (project_id)
    REFERENCES projects (id);

ALTER TABLE money_location_types
  ADD COLUMN project_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT money_location_types_project_id_foreign FOREIGN KEY (project_id)
    REFERENCES projects (id);

COMMIT;
