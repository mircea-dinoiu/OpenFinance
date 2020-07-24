import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {useSelectedProject} from 'state/projects';
import {Categories} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export const useCategoriesReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Categories>({
            url: makeUrl(routes.categories, {projectId: project.id}),
        });

        dispatch(
            updateState({
                // @ts-ignore
                categories: r.data,
            }),
        );
    };
};
