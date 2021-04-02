import {User} from 'domain/users/defs';
import uniqueId from 'lodash/uniqueId';
import {combineReducers} from 'redux';
import {currenciesReducer} from 'domain/currencies/state';
import {Action} from 'state/defs';
import {inventoriesReducer} from 'state/inventories';
import {privacyToggle} from 'state/privacyToggle';
import {propertiesReducer} from 'state/properties';
import {stocks} from 'state/stocks';
import {summaryReducer} from 'state/summary';
import {bindToUpdateState} from 'state/utils';
import {Snackbar} from 'types';

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
    stocks,
    moneyLocations,
    snackbars,
    privacyToggle,
    summary: summaryReducer,
    inventories: inventoriesReducer,
    properties: propertiesReducer,
});
