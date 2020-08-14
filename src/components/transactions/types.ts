import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {TransactionStatus} from 'defs';
import {RepeatOption} from 'js/defs';
import {$Values} from 'utility-types';

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

export type TransactionRepeat = $Values<typeof RepeatOption>;
export type TransactionForm = {
    sum: number;
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
    repeatOccurrences: number;
    repeat: TransactionRepeat | null;
    status: TransactionStatus;
};
export type TransactionModel = {
    id: number;
    fitid: string | null;
    categories: number[];
    favorite: number;
    item: string;
    notes: string;
    sum: number;
    weight: number | null;
    users: {
        [key: string]: number;
    };
    repeat_occurrences: number;
    repeat_link_id: number | null,
    repeat: null | TransactionRepeat;
    created_at: number;
    updated_at: number;
    hidden: boolean;
    status: TransactionStatus;
    money_location_id: number;
    money_location: {currency_id: number};
    sum_per_weight: number | null;
};
export type UpdateRecords = (
    ids: number[],
    data: Partial<TransactionModel>,
) => Promise<void>;
