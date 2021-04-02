import {Action, GlobalState} from 'app/state/defs';
import {useSelector} from 'react-redux';
import {Snackbar} from 'snackbars/defs';

export const useSnackbars = (): Snackbar[] => useSelector((s: GlobalState) => s.snackbars);
export const showSnackbar = (value: Snackbar) => ({
    type: Action.SHOW_SNACKBAR,
    value,
});
export const hideSnackbar = (value: string) => ({
    type: Action.HIDE_SNACKBAR,
    value,
});
export const snackbarsReducer = (
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
