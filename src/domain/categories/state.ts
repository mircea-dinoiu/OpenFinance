import {Api} from 'app/Api';
import {Categories} from 'domain/categories/defs';
import {useDispatch, useSelector} from 'react-redux';
import {updateState} from 'app/state/actionCreators';
import {GlobalState} from 'app/state/defs';
import {useSelectedProject} from 'app/state/projects';
import {createXHR} from 'app/utils/fetch';
import {makeUrl} from 'app/utils/url';

export const useCategoriesReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Categories>({
            url: makeUrl(Api.categories, {projectId: project.id}),
        });

        dispatch(
            updateState({
                // @ts-ignore
                categories: r.data,
            }),
        );
    };
};
export const useCategories = () => useSelector((s: GlobalState) => s.categories);
