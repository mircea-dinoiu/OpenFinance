import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {Account} from 'types';
import {createXHR} from 'utils/fetch';

export const useAccountsReader = () => {
    const dispatch = useDispatch();

    return async () => {
        const r = await createXHR<Account>({
            url: routes.moneyLocations,
        });

        dispatch(
            updateState({
                // @ts-ignore
                moneyLocations: r.data,
            }),
        );
    };
};
