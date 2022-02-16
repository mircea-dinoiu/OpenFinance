import {useTransactionsContext} from 'transactions/TransactionsContext';
import {useDispatch} from 'react-redux';
import {TransactionModel} from 'transactions/defs';
import {Api} from 'app/Api';
import {refreshTokenAction as onRefreshWidgets} from 'refreshWidgets/state';

export const useUpdateTransactions = () => {
    const tc = useTransactionsContext();
    const dispatch = useDispatch();

    return async (ids: number[], data: Partial<TransactionModel>) => {
        try {
            const payload = ids.map((id) => ({id, ...data}));

            await tc.dispatchRequest({data: payload}, Api.transactions, 'PUT');

            dispatch(onRefreshWidgets());
        } catch (e) {
            console.error(e);
            // todo
        }
    };
};
