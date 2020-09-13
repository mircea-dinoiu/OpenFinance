ALTER TABLE stocks ADD COLUMN created_at timestamp default '0000-00-00 00:00:00' not null;
ALTER TABLE stocks ADD COLUMN updated_at timestamp default '0000-00-00 00:00:00' not null;
