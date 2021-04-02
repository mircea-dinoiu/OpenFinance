import {Api} from 'defs/Api';
import {Account, AccountStatus} from 'domain/accounts/defs';
import {sortBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {GlobalState} from 'state/defs';
import {useSelectedProject} from 'state/projects';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export const useAccountsReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Account>({
            url: makeUrl(Api.moneyLocations, {projectId: project.id}),
        });

        dispatch(
            updateState({
                // @ts-ignore
                moneyLocations: sortBy(r.data, 'name'),
            }),
        );
    };
};

export const useAccounts = () => useSelector((s: GlobalState) => s.moneyLocations);

export const useOpenAccounts = () =>
    useSelector((s: GlobalState) => s.moneyLocations.filter((a) => a.status === AccountStatus.OPEN));
