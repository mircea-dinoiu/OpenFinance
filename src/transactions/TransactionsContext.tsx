import React, {useContext} from 'react';
import {TransactionForm} from 'transactions/form';

type TTransactionsContextState = {
    fieldToEdit: null | keyof TransactionForm;
    selectedIds: number[];
    editorAnchorEl: any;
};

export type TTransactionsContext = {
    state: TTransactionsContextState;
    setState: (values: Partial<TTransactionsContextState>) => void;
};

export const TransactionsContextDefaultState: TTransactionsContextState = {
    fieldToEdit: null,
    editorAnchorEl: null,
    selectedIds: [],
};

export const TransactionsContext = React.createContext<TTransactionsContext>({
    state: TransactionsContextDefaultState,
    setState: () => {},
});

export const useTransactionsContext = () => useContext(TransactionsContext);
