import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {useSelectedProject} from 'state/projects';
import {Account} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {sortBy} from 'lodash';

export const useAccountsReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Account>({
            url: makeUrl(routes.moneyLocations, {projectId: project.id}),
        });

        dispatch(
            updateState({
                // @ts-ignore
                moneyLocations: sortBy(r.data, 'name'),
            }),
        );
    };
};

export enum AccountStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    LOCKED = 'locked',
}
