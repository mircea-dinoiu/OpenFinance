import * as React from 'react';
import {TransactionStatus, IncludeOption, ShiftDateOption} from 'defs';
import {RepeatOption} from 'js/defs';
import {$Values} from 'utility-types';
import {AlertProps} from '@material-ui/lab';

export type ScreenQueries = {
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
};

export type Preferences = {
    endDate: string;
    endDateIncrement: ShiftDateOption;
    include: IncludeOption;
    includePending: boolean;
};

export type Currency = {
    id: number;
    iso_code: string;
    currency: string;
    symbol: string;
    rates: {
        [key: string]: number;
    };
};

export type CurrenciesApi = {
    default: number;
    from_cache: boolean;
    map: {
        [key: string]: Currency;
    };
};

export type Currencies = {selected: Currency} & {
    [key: number]: Currency;
};

export type CurrencyIdentifier = string | number | Currency;

export type Category = {
    id: number;
    name: string;
    color: string;
    expenses: number;
};

export type Categories = Category[];

export type Account = {
    currency_id: number;
    id: number;
    name: string;
    status: 'open' | 'closed' | 'locked';
    type_id: number;
};

export type Accounts = Account[];

export type AccountType = {
    id: number;
    name: string;
};

export type AccountTypes = AccountType[];

export type User = {
    avatar: string;
    first_name: string;
    last_name: string;
    full_name: string;
    id: number;
    preferred_money_location_id: number;
};

export type Users = {
    current: User;
    list: User[];
};

export type TransactionType = 'deposit' | 'withdrawal';
export type TransactionRepeat = $Values<typeof RepeatOption>;

export type TransactionForm = {
    id: number;
    sum: number;
    description: string;
    favorite: number;
    hidden: boolean;
    paymentMethod: number;
    weight: number;
    date: number;
    chargedPersons: {
        [key: string]: number;
    };
    categories: number[];
    repeatOccurrences: number;
    repeat: TransactionRepeat;
    type: TransactionType;
    status: TransactionStatus;
};

export type TransactionModel = {
    id: number;
    categories: number[];
    favorite: number;
    item: string;
    sum: number;
    weight: number;
    users: {
        [key: string]: number;
    };
    repeat_occurrences: number;
    repeat: null | TransactionRepeat;
    persist: boolean;
    type: TransactionType;
    created_at: Date;
    hidden: boolean;
    status: TransactionStatus;
    money_location_id: number;
    money_location: {currency_id: number};
};

export type SnackbarProps = {
    message: React.ReactNode;
};

export type Snackbar = {
    id: string;
    severity: AlertProps['severity'];
} & SnackbarProps;

export type GlobalState = {
    preferences: Preferences;

    currencies: Currencies;
    currenciesDrawerOpen: boolean;

    categories: Categories;
    moneyLocationTypes: AccountTypes;
    moneyLocations: Accounts;
    screen: ScreenQueries;
    screenSize: ScreenQueries;
    refreshWidgets: string;
    user: Users;
    snackbars: Snackbar[];
};
