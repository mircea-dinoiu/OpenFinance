import uniqueId from 'lodash/uniqueId';
import {combineReducers} from 'redux';
import {currencies} from 'state/currencies';
import {Action} from 'state/defs';
import {privacyToggle} from 'state/privacyToggle';
import {summaryReducer} from 'state/summary';
import {bindToUpdateState} from 'state/utils';
import {ScreenQueries, Snackbar, User} from 'types';
import {getScreenQueries} from 'utils/getScreenQueries';

const screen = (
    state = getScreenQueries(),
    action: {
        type: Action;
        value: ScreenQueries;
    },
) => (action.type === Action.SET_SCREEN ? action.value : state);
const screenSize = (
    state = getScreenQueries(),
    action: {
        type: Action;
        value: ScreenQueries;
    },
) => (action.type === Action.SET_SCREEN ? action.value : state);
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
    action:
        | {value: string; type: Action.HIDE_SNACKBAR}
        | {value: Snackbar; type: Action.SHOW_SNACKBAR},
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
const moneyLocationTypes = bindToUpdateState('moneyLocationTypes', []);

export const combinedReducers = combineReducers({
    // @deprecated screen is a global in Window, use screenSize instead
    screen,
    screenSize,

    currencies,

    refreshWidgets,
    user,
    categories,
    moneyLocations,
    moneyLocationTypes,
    snackbars,
    privacyToggle,
    summary: summaryReducer,
});
