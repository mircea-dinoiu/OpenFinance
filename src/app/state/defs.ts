import {Accounts} from 'accounts/defs';
import {Categories} from 'categories/defs';
import {Currencies} from 'currencies/defs';
import {Inventory} from 'inventories/defs';
import {Property} from 'properties/defs';
import {Snackbar} from 'snackbars/defs';
import {Stock} from 'stocks/defs';
import {Bootstrap} from 'users/defs';
import {Summary} from 'summary/state';

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
    projectId: number;
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
