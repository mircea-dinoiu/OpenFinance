import {routes} from 'defs/routes';
import {useDispatch} from 'react-redux';
import {updateState} from 'state/actionCreators';
import {Account} from 'types';
import {createXHR} from 'utils/fetch';

export const useAccountTypesReader = () => {
    const dispatch = useDispatch();

    return async () => {
        const r = await createXHR<Account>({
            url: routes.moneyLocationTypes,
        });

        dispatch(
            updateState({
                // @ts-ignore
                moneyLocationTypes: r.data,
            }),
        );
    };
};
