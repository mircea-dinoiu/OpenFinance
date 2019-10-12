// @flow

import {useDispatch, useSelector} from 'react-redux';
import * as React from 'react';
import {bindActionCreators} from 'redux';
import {
    setUsers,
    updatePreferences,
    updateState,
} from 'state/actionCreators';
import {
    TypeUsers,
    TypeCurrencies,
    TypeScreenQueries,
    TypeSnackbar,
    TypeGlobalState,
} from 'types';

export const useActions = (actions) => {
    const dispatch = useDispatch();

    return React.useMemo(() => bindActionCreators(actions, dispatch), [
        dispatch,
    ]);
};
export const useScreenSize = (): TypeScreenQueries =>
    useSelector((s: TypeGlobalState) => s.screenSize);
export const useCurrencies = (): TypeCurrencies =>
    useSelector((s: TypeGlobalState) => s.currencies);
export const useUsers = (): TypeUsers =>
    useSelector((s: TypeGlobalState) => s.user);
export const useUsersWithActions = (): [TypeUsers, {
    setUsers: typeof setUsers
}] =>
    [useUsers(), useActions({
        setUsers,
    })];

export const useMoneyLocations = () =>
    useSelector((s: TypeGlobalState) => s.moneyLocations);
export const usePreferences = () =>
    useSelector((s: TypeGlobalState) => s.preferences);
export const usePreferencesWithActions = () => [
    usePreferences(),
    useActions({
        updatePreferences,
    }),
];
export const useCategories = () =>
    useSelector((s: TypeGlobalState) => s.categories);
export const useSnackbars = (): TypeSnackbar[] =>
    useSelector((s: TypeGlobalState) => s.snackbars);
export const useCurrenciesDrawerOpenWithSetter = (): [
    boolean,
    (value: boolean) => void,
] => {
    const dispatch = useDispatch();

    return [
        useSelector((s: TypeGlobalState) => s.currenciesDrawerOpen),
        (value: boolean) => {
            dispatch(
                updateState({
                    currenciesDrawerOpen: value,
                }),
            );
        },
    ];
};
export const useTitleWithSetter = (): [string, (title: string) => void] => {
    const dispatch = useDispatch();

    return [
        useSelector((s: TypeGlobalState) => s.title),
        (title: string) => {
            dispatch(updateState({title}));
        },
    ];
};

export const useMoneyLocationTypes = () =>
    useSelector((s: TypeGlobalState) => s.moneyLocationTypes);

export const useRefreshWidgets = () =>
    useSelector((s: TypeGlobalState) => s.refreshWidgets);
