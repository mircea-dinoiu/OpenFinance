create table inventories (id int unsigned auto_increment primary key, name varchar(255) not null, project_id int unsigned not null, constraint inventories__project_id__foreign foreign key (project_id) references projects (id));

ALTER TABLE expenses ADD COLUMN inventory_id INT UNSIGNED DEFAULT NULL, ADD CONSTRAINT expenses__inventory_id__foreign FOREIGN KEY (inventory_id) REFERENCES inventories (id);
