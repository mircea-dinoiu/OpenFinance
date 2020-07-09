import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {Categories} from 'types';
import {createXHR} from 'utils/fetch';

export const useCategoriesReader = () => {
    const dispatch = useDispatch();

    return async () => {
        const categoriesResponse = await createXHR<Categories>({
            url: routes.categories,
        });

        dispatch(
            updateState({
                // @ts-ignore
                categories: categoriesResponse.data,
            }),
        );
    };
};
