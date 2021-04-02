import {GlobalState} from 'app/state/defs';
import {Project} from 'projects/defs';
import {useSelector} from 'react-redux';

export const useProjects = (): Project[] => useSelector((s: GlobalState) => s.user?.projects ?? []);

export const useSelectedProject = (): Project => {
    const id = new URLSearchParams(window.location.search).get('projectId');
    const projects = useProjects();

    return projects.find((p) => p.id === Number(id)) ?? projects[0];
};
