import {Action} from 'state/defs';
import {TypeGlobalState, TypePreferences, TypeScreenQueries, TypeSnackbar, TypeUsers} from 'types';

export const updateState = (state: Partial<TypeGlobalState>) => ({
    type: Action.UPDATE_STATE,
    state,
});

export const setUsers = (users: null | TypeUsers) => ({
    type: Action.SET_USERS,
    value: users,
});

export const setScreen = (value: TypeScreenQueries) => ({
    type: Action.SET_SCREEN,
    value,
});
export const updatePreferences = (value: Partial<TypePreferences>) => ({
    type: Action.UPDATE_PREFERENCES,
    value,
});
export const refreshWidgets = () => ({type: Action.REFRESH_WIDGETS});

export const showSnackbar = (value: TypeSnackbar) => ({
    type: Action.SHOW_SNACKBAR,
    value,
});
export const hideSnackbar = (value: string) => ({
    type: Action.HIDE_SNACKBAR,
    value,
});
