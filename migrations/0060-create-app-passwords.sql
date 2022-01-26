CREATE TABLE app_passwords
(
    id int unsigned auto_increment
    		primary key,
    name varchar(255) not null,
    password varchar(255) not null,
    user_id int unsigned not null,
    constraint app_passwords__user_id__foreign
    		foreign key (user_id) references users (id)
);