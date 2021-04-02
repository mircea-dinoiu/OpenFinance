import {Snackbar} from 'domain/snackbars/defs';
import {User} from 'domain/users/defs';
import uniqueId from 'lodash/uniqueId';
import {combineReducers} from 'redux';
import {currenciesReducer} from 'domain/currencies/state';
import {Action} from 'state/defs';
import {inventoriesReducer} from 'domain/inventories/state';
import {privacyToggleReducer} from 'domain/privacyToggle/state';
import {propertiesReducer} from 'domain/properties/state';
import {stocksReducer} from 'domain/stocks/state';
import {summaryReducer} from 'state/summary';
import {bindToUpdateState} from 'state/utils';

const refreshWidgets = (
    state = uniqueId(),
    action: {
        type: Action;
    },
) => (action.type === Action.REFRESH_WIDGETS ? uniqueId() : state);
const user = (state: User | null = null, action: {type: Action; value: User}) =>
    action.type === Action.SET_USERS ? action.value : state;

const snackbars = (
    state: Snackbar[] = [],
    action: {value: string; type: Action.HIDE_SNACKBAR} | {value: Snackbar; type: Action.SHOW_SNACKBAR},
) => {
    switch (action.type) {
        case Action.SHOW_SNACKBAR:
            return state.concat(action.value);
        case Action.HIDE_SNACKBAR:
            return state.filter((snackbar) => snackbar.id !== action.value);
    }

    return state;
};
const categories = bindToUpdateState('categories', []);
const moneyLocations = bindToUpdateState('moneyLocations', []);

export const combinedReducers = combineReducers({
    currencies: currenciesReducer,

    refreshWidgets,
    user,
    categories,
    stocks: stocksReducer,
    moneyLocations,
    snackbars,
    privacyToggle: privacyToggleReducer,
    summary: summaryReducer,
    inventories: inventoriesReducer,
    properties: propertiesReducer,
});
