import React, {useContext} from 'react';
import {TransactionForm} from 'transactions/form';

type TTransactionsContextState = {
    fieldToEdit: null | keyof TransactionForm;
    selectedIds: number[];
    editorAnchorEl: any;
    loading: number;
    firstLoad: boolean;
};

type TTransactionsContextSetState = (
    values:
        | Partial<TTransactionsContextState>
        | ((prevState: TTransactionsContextState) => Partial<TTransactionsContextState>),
) => void;

export type TTransactionsContext = {
    state: TTransactionsContextState;
    setState: TTransactionsContextSetState;
};

export const TransactionsContextDefaultState: TTransactionsContextState = {
    fieldToEdit: null,
    editorAnchorEl: null,
    selectedIds: [],
    firstLoad: true,
    loading: 0,
};

export const TransactionsContext = React.createContext<TTransactionsContext>({
    state: TransactionsContextDefaultState,
    setState: () => {},
});

export const useTransactionsContext = () => useContext(TransactionsContext);
export const useTransactionsState = (): [TTransactionsContextState, TTransactionsContextSetState] => {
    const context = useTransactionsContext();

    return [context.state, context.setState];
};
