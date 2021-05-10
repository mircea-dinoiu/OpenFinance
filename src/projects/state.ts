import {paths} from 'app/paths';
import {GlobalState} from 'app/state/defs';
import {TProject} from 'projects/defs';
import {useSelector} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';

export const useProjects = (): TProject[] => useSelector((s: GlobalState) => s.user?.projects ?? []);

export const useSelectedProject = (): TProject => {
    const match = useRouteMatch<{id: string}>(Object.values(paths).filter((p) => p.startsWith('/p/')));
    const id = match?.params.id;
    const projects = useProjects();

    return projects.find((p) => p.id === Number(id)) ?? projects[0];
};
