import {Snackbar} from 'snackbars/defs';
import {Bootstrap} from 'users/defs';
import {Action, GlobalState} from 'app/state/defs';

export const updateState = (state: Partial<GlobalState>) => ({
    type: Action.UPDATE_STATE,
    state,
});

export const setUsers = (users: null | Bootstrap) => ({
    type: Action.SET_USERS,
    value: users,
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
