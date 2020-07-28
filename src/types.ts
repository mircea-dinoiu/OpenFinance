import {AlertProps} from '@material-ui/lab';
import * as React from 'react';
import {Project} from 'state/projects';

export type ScreenQueries = {
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
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
    full_name: string;
    id: number;
};

export type Bootstrap = {
    current: User;
    user: User;
    projects: Project[];
};

export type SnackbarProps = {
    message: React.ReactNode;
};

export type Snackbar = {
    id: string;
    severity: AlertProps['severity'];
} & SnackbarProps;

export type GlobalState = {
    currencies: Currencies;
    privacyToggle: boolean;

    categories: Categories;
    moneyLocationTypes: AccountTypes;
    moneyLocations: Accounts;
    screen: ScreenQueries;
    screenSize: ScreenQueries;
    refreshWidgets: string;
    user: Bootstrap;
    snackbars: Snackbar[];
};
