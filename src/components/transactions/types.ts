import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {TransactionStatus} from 'defs';
import {RepeatOption} from 'js/defs';
import {$Values} from 'utility-types';

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

type ByML = {
    cashValue: number;
    description: string;
    reference: number;
    group: number;
    currencyId: number;
    index: number;
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

export type SummarySubCategoryModel = {
    description: string;
    reference: string;
    currencyId: number;
    cashValue: number;
};

export type BalanceByLocation = {
    cash: BalanceByLocationCash[];
    stocks: BalanceByLocationStock[];
};

export type TransactionRepeat = $Values<typeof RepeatOption>;
export type TransactionForm = {
    price: number;
    quantity: number;
    description: string;
    notes: string;
    favorite: number;
    hidden: boolean;
    paymentMethod: number;
    weight: number | null;
    date: MaterialUiPickersDate;
    chargedPersons: {
        [key: string]: number;
    };
    categories: number[];
    repeatOccurrences: number | null;
    repeatFactor: number;
    repeat: TransactionRepeat | null;
    status: TransactionStatus;
    stockId: number | null;
};
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
    repeat: null | TransactionRepeat;
    created_at: number;
    updated_at: number;
    hidden: boolean;
    status: TransactionStatus;
    money_location_id: number;
    money_location: {currency_id: number};
    sum_per_weight: number | null;
    quantity: number;
    stock_id: number | null;
};
export type UpdateRecords = (ids: number[], data: Partial<TransactionModel>) => Promise<void>;
