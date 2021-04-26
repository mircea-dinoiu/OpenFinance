import {Api} from 'app/Api';
import {createXHR} from 'app/fetch';
import {bindToUpdateState} from 'app/state/bindToUpdateState';
import {GlobalState} from 'app/state/defs';
import {updateState} from 'app/state/updateState';
import {makeUrl} from 'app/url';
import {TCategories} from 'categories/defs';
import {useSelectedProject} from 'projects/state';
import {useDispatch, useSelector} from 'react-redux';

export const useCategoriesReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<TCategories>({
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
export const categoriesReducer = bindToUpdateState('categories', []);
