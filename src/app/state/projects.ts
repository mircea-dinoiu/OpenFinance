import {User} from 'domain/users/defs';
import {useSelector} from 'react-redux';
import {GlobalState} from 'app/state/defs';

export type Project = {
    id: number;
    default_currency_id: number;
    name: string;
    users: User[];
};

export const useProjects = (): Project[] => useSelector((s: GlobalState) => s.user?.projects ?? []);

export const useSelectedProject = (): Project => {
    const id = new URLSearchParams(window.location.search).get('projectId');
    const projects = useProjects();

    return projects.find((p) => p.id === Number(id)) ?? projects[0];
};
