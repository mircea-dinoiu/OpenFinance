import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {useSelectedProject} from 'state/projects';
import {Account} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export const useAccountTypesReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Account>({
            url: makeUrl(routes.moneyLocationTypes, {projectId: project.id}),
        });

        dispatch(
            updateState({
                // @ts-ignore
                moneyLocationTypes: r.data,
            }),
        );
    };
};
