// @flow

import {useDispatch, useSelector} from 'react-redux';
import * as React from 'react';
import {bindActionCreators} from 'redux';
import {
    toggleLoading,
    updatePreferences,
    updateState,
} from 'common/state/actionCreators';
import type {
    TypeUsers,
    TypeCurrencies,
    TypeScreenQueries,
    TypeSnackbar,
} from 'common/types';

export const useActions = <T>(actions: T): T => {
    const dispatch = useDispatch();

    return React.useMemo(() => bindActionCreators(actions, dispatch), [
        dispatch,
    ]);
};
export const useScreenSize = (): TypeScreenQueries =>
    useSelector((s) => s.screenSize);
export const useCurrencies = (): TypeCurrencies =>
    useSelector((s) => s.currencies);
export const useUser = (): TypeUsers => useSelector((s) => s.user);
export const useMoneyLocations = () => useSelector((s) => s.moneyLocations);
export const usePreferences = () => useSelector((s) => s.preferences);
export const usePreferencesWithActions = () => [
    usePreferences(),
    useActions({
        updatePreferences,
    }),
];
export const useCategories = () => useSelector((s) => s.categories);
export const useSnackbars = (): TypeSnackbar[] =>
    useSelector((s) => s.snackbars);
export const useCurrenciesDrawerOpenWithSetter = () => {
    const dispatch = useDispatch();

    return [
        useSelector((s) => s.currenciesDrawerOpen),
        (value: boolean) => {
            dispatch(
                updateState({
                    currenciesDrawerOpen: value,
                }),
            );
        },
    ];
};
export const useLoadingWithSetter = () => {
    const dispatch = useDispatch();

    return [
        useSelector((s) => s.loading),
        (loading: boolean) => {
            dispatch(toggleLoading(loading));
        },
    ];
};
export const usePageWithSetter = () => {
    const dispatch = useDispatch();

    return [
        useSelector((s) => s.ui),
        (ui: React.Node) => {
            dispatch(updateState({ui}));
        },
    ];
};
export const useTitleWithSetter = () => {
    const dispatch = useDispatch();

    return [
        useSelector((s) => s.title),
        (title: string) => {
            dispatch(updateState({title}));
        },
    ];
};

export const useMoneyLocationTypes = () =>
    useSelector((s) => s.moneyLocationTypes);

export const useRefreshWidgets = () => useSelector((s) => s.refreshWidgets);
