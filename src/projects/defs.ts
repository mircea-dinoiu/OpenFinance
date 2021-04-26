import {TUser} from 'users/defs';

export type TProject = {
    id: number;
    default_currency_id: number;
    name: string;
    users: TUser[];
};
