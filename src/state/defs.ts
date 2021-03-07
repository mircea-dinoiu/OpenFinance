export enum Action {
    UPDATE_STATE = 'UPDATE_STATE',
    SET_USERS = 'SET_USERS',
    SET_SCREEN = 'SET_SCREEN',
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
