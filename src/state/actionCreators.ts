import {Action} from 'state/defs';
import {GlobalState, Preferences, ScreenQueries, Snackbar, Users} from 'types';

export const updateState = (state: Partial<GlobalState>) => ({
    type: Action.UPDATE_STATE,
    state,
});

export const setUsers = (users: null | Users) => ({
    type: Action.SET_USERS,
    value: users,
});

export const setScreen = (value: ScreenQueries) => ({
    type: Action.SET_SCREEN,
    value,
});
export const updatePreferences = (value: Partial<Preferences>) => ({
    type: Action.UPDATE_PREFERENCES,
    value,
});
export const refreshWidgets = () => ({type: Action.REFRESH_WIDGETS});

export const showSnackbar = (value: Snackbar) => ({
    type: Action.SHOW_SNACKBAR,
    value,
});
export const hideSnackbar = (value: string) => ({
    type: Action.HIDE_SNACKBAR,
    value,
});
