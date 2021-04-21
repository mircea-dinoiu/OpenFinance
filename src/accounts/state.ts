import {Account, AccountStatus} from 'accounts/defs';
import {Api} from 'app/Api';
import {createXHR} from 'app/fetch';
import {bindToUpdateState} from 'app/state/bindToUpdateState';
import {GlobalState} from 'app/state/defs';
import {updateState} from 'app/state/updateState';
import {makeUrl} from 'app/url';
import {sortBy} from 'lodash';
import {useSelectedProject} from 'projects/state';
import {useDispatch, useSelector} from 'react-redux';

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
export const accountsReducer = bindToUpdateState('moneyLocations', []);
