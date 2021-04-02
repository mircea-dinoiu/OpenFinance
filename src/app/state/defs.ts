import {Accounts} from 'domain/accounts/defs';
import {Categories} from 'domain/categories/defs';
import {Currencies} from 'domain/currencies/defs';
import {Inventory} from 'domain/inventories/defs';
import {Property} from 'domain/properties/defs';
import {Snackbar} from 'domain/snackbars/defs';
import {Stock} from 'domain/stocks/defs';
import {Bootstrap} from 'domain/users/defs';
import {Summary} from 'app/state/summary';

export enum Action {
    UPDATE_STATE = 'UPDATE_STATE',
    SET_USERS = 'SET_USERS',
    SET_DISCRETE = 'SET_DISCRETE',
    REFRESH_WIDGETS = 'REFRESH_WIDGETS',

    SHOW_SNACKBAR = 'SHOW_SNACKBAR',
    HIDE_SNACKBAR = 'HIDE_SNACKBAR',

    SUMMARY_ASSIGNED = '@summary/assigned',
}

export type LazyLoadedState<D> = {
    isLoaded: boolean;
    isLoading: boolean;
    data: D;
};

export type LazyLoadedStateWithFetch<D> = LazyLoadedState<D> & {
    fetch: () => Promise<void>;
};
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
