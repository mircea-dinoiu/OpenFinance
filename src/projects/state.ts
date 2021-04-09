import {paths} from 'app/paths';
import {GlobalState} from 'app/state/defs';
import {Project} from 'projects/defs';
import {useSelector} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';

export const useProjects = (): Project[] => useSelector((s: GlobalState) => s.user?.projects ?? []);

export const useSelectedProject = (): Project => {
    const match = useRouteMatch<{id: string}>([paths.dashboard, paths.transactions]);
    const id = match?.params.id;
    const projects = useProjects();

    return projects.find((p) => p.id === Number(id)) ?? projects[0];
};
