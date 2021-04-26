import {TProject} from 'projects/defs';

export type TUser = {
    avatar: string;
    full_name: string;
    id: number;
};
export type TBootstrap = {
    current: TUser;
    user: TUser;
    projects: TProject[];
};
