import {Action} from 'state/defs';
import uniqueId from 'lodash/uniqueId';
import {privacyToggle} from 'state/privacyToggle';
import {getScreenQueries} from 'utils/getScreenQueries';
import {combineReducers} from 'redux';
import {bindToUpdateState} from 'state/utils';
import {currencies, currenciesDrawerOpen} from 'state/currencies';

const screen = (state = getScreenQueries(), action) =>
    action.type === Action.SET_SCREEN ? action.value : state;
const screenSize = (state = getScreenQueries(), action) =>
    action.type === Action.SET_SCREEN ? action.value : state;
const refreshWidgets = (state = uniqueId(), action) =>
    action.type === Action.REFRESH_WIDGETS ? uniqueId() : state;
const user = (state = null, action) =>
    action.type === Action.SET_USERS ? action.value : state;

const snackbars = (state = [], action) => {
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
const moneyLocationTypes = bindToUpdateState('moneyLocationTypes', []);

export const combinedReducers = combineReducers({
    // @deprecated screen is a global in Window, use screenSize instead
    screen,
    screenSize,

    currencies,
    currenciesDrawerOpen,

    refreshWidgets,
    user,
    categories,
    moneyLocations,
    moneyLocationTypes,
    snackbars,
    privacyToggle,
});
