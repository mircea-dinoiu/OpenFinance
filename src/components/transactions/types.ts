import {TransactionModel} from 'types';

export type SummaryModel = {
    currencyId: number | string;
    description: string;
    group?: number;
    reference: string;
    sum: number;
    index?: number;
};

type ByUser = {
    sum: number;
    description: string;
    reference: string;
    currencyId: string;
};

type ByML = {
    sum: number;
    description: string;
    reference: number;
    group: number;
    currencyId: number;
    index: number;
};

type ExpensesData = {
    byUser: ByUser[];
    byML: ByML[];
};

type ExpensesByCategory = {
    sum: number;
    description: string;
    reference: string;
    group: number;
    currencyId: number;
    index: number;
};

type RemainingData = {
    byUser: ByUser[];
};

export type SummaryResults = {
    expensesData: ExpensesData;
    expensesByCategory: ExpensesByCategory[];
    remainingData: RemainingData;
};

export type SummarySubCategoryModel = {
    description: string;
    reference: string;
    currencyId: number;
    sum: number;
};

export type BalanceByLocation = Record<number, number>;

export type UpdateRecords = (
    ids: number[],
    data: Partial<TransactionModel>,
) => Promise<void>;
