alter table money_locations modify type enum('brokerage', 'cash', 'checking', 'savings', 'credit', 'loan') default 'cash' not null;

