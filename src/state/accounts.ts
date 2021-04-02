import {Api} from 'defs/Api';
import {sortBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {useSelectedProject} from 'state/projects';
import {Account, GlobalState} from 'types';
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

export enum AccountStatus {
    OPEN = 'open',
    LOCKED = 'locked',
    CLOSED = 'closed',
}

export enum AccountType {
    CASH = 'cash',
    CREDIT = 'credit',
    LOAN = 'loan',
    BROKERAGE = 'brokerage',
}

export const useAccounts = () => useSelector((s: GlobalState) => s.moneyLocations);

export const useAccountsOpen = () =>
    useSelector((s: GlobalState) => s.moneyLocations.filter((a) => a.status === AccountStatus.OPEN));
