import {AlertProps} from '@material-ui/lab';
import {AccountStatus, AccountType} from 'domain/accounts/defs';
import {Categories} from 'domain/categories/defs';
import {Currencies} from 'domain/currencies/defs';
import * as React from 'react';
import {LazyLoadedState} from 'state/defs';
import {Inventory} from 'state/inventories';
import {Project} from 'state/projects';
import {Property} from 'state/properties';
import {Summary} from 'state/summary';

export enum StockType {
    CUSTOM = 'custom',
    MUTUAL_FUND = 'mf',
    ETF = 'etf',
    STOCK = 'stock',
    CRYPTO = 'crypto',
}

export type Stock = {id: number; price: number; symbol: string; currency_id: number; type: StockType};

export type Account = {
    currency_id: number;
    id: number;
    name: string;
    status: AccountStatus;
    type: AccountType;
    credit_limit: number | null;
    credit_apr: number | null;
    credit_minpay: number | null;
    credit_dueday: number | null;
};

export type Accounts = Account[];

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
    moneyLocations: Accounts;
    refreshWidgets: string;
    user: Bootstrap;
    snackbars: Snackbar[];
    summary: Summary;
    stocks: Stock[];
    inventories: Inventory[];
    properties: LazyLoadedState<Property[]>;
};
