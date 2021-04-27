import {RepeatOption} from './RepeatOption';

type BalanceByLocationCash = {
    money_location_id: number;
    sum: number;
};

export type BalanceByLocationStock = {
    money_location_id: number;
    quantity: number;
    cost_basis: number;
    stock_id: number;
};

export type BalanceByLocationInventory = {
    inventory_id: number;
    currency_id: number;
    sum: number;
    name: string;
};

export type SummaryModel = {
    currencyId: number | string;
    description: string;
    group?: number | string;
    reference: string;
    cashValue: number;
    stocks?: BalanceByLocationStock[];
    index?: number;
};

type ByUser = {
    cashValue: number;
    description: string;
    reference: string;
    currencyId: string;
};

type ExpensesByCategory = {
    cashValue: number;
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
    expensesByCategory: ExpensesByCategory[];
    remainingData: RemainingData;
};

export type BalanceByLocation = {
    cash: BalanceByLocationCash[];
    stocks: BalanceByLocationStock[];
    inventories: BalanceByLocationInventory[];
};

export enum TransactionStatus {
    draft = 'draft',
    pending = 'pending',
    finished = 'finished',
}

export type TransactionModel = {
    id: number;
    fitid: string | null;
    categories: number[];
    favorite: number;
    item: string;
    notes: string;
    price: number;
    weight: number | null;
    users: {
        [key: string]: number;
    };
    repeat_occurrences: number | null;
    repeat_factor: number;
    repeat_link_id: number | null;
    repeat: null | RepeatOption;
    created_at: number;
    updated_at: number;
    hidden: boolean;
    status: TransactionStatus;
    money_location_id: number;
    money_location: {currency_id: number};
    sum_per_weight: number | null;
    quantity: number;
    stock_id: number | null;
    inventory_id: number | null;
};
export type UpdateRecords = (ids: number[], data: Partial<TransactionModel>) => Promise<void>;
