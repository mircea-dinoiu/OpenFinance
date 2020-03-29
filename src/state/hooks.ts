import {useDispatch, useSelector} from 'react-redux';
import * as React from 'react';
import {useCallback} from 'react';
import {bindActionCreators} from 'redux';
import {refreshWidgets, setUsers, updatePreferences, updateState} from 'state/actionCreators';
import {GlobalState, ScreenQueries, Snackbar, Users, Preferences} from 'types';

export const useActions = <T>(actions: T): T => {
    const dispatch = useDispatch();

    // @ts-ignore
    return React.useMemo(() => bindActionCreators(actions, dispatch), [
        actions,
        dispatch,
    ]);
};
export const useScreenSize = (): ScreenQueries =>
    useSelector((s: GlobalState) => s.screenSize);
export const useUsers = (): Users =>
    useSelector((s: GlobalState) => s.user);
export const useUsersWithActions = (): [
    Users,
    {
        setUsers: typeof setUsers;
    },
] => [
    useUsers(),
    useActions({
        setUsers,
    }),
];

export const useMoneyLocations = () =>
    useSelector((s: GlobalState) => s.moneyLocations);
export const usePreferences = () =>
    useSelector((s: GlobalState) => s.preferences);
export const usePreferencesWithActions = (): [
    Preferences,
    {updatePreferences: typeof updatePreferences},
] => [
    usePreferences(),
    useActions({
        updatePreferences,
    }),
];
export const useCategories = () =>
    useSelector((s: GlobalState) => s.categories);
export const useSnackbars = (): Snackbar[] =>
    useSelector((s: GlobalState) => s.snackbars);

export const useMoneyLocationTypes = () =>
    useSelector((s: GlobalState) => s.moneyLocationTypes);

export const useRefreshWidgets = () =>
    useSelector((s: GlobalState) => s.refreshWidgets);
export const useRefreshWidgetsDispatcher = () => useActions(refreshWidgets);
