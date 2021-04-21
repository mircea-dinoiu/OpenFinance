import {Project} from 'projects/defs';

export type User = {
    avatar: string;
    full_name: string;
    id: number;
};
export type Bootstrap = {
    current: User;
    user: User;
    projects: Project[];
};
