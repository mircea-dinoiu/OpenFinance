import {User} from 'users/defs';

export type Project = {
    id: number;
    default_currency_id: number;
    name: string;
    users: User[];
};
