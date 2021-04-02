import {Project} from 'app/state/projects';

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
