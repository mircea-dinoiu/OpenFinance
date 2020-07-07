import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import {refreshWidgets, setUsers} from 'state/actionCreators';
import {GlobalState, ScreenQueries, Snackbar, Users} from 'types';

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

export const useCategories = () =>
    useSelector((s: GlobalState) => s.categories);
export const useSnackbars = (): Snackbar[] =>
    useSelector((s: GlobalState) => s.snackbars);

export const useMoneyLocationTypes = () =>
    useSelector((s: GlobalState) => s.moneyLocationTypes);

export const useRefreshWidgets = () =>
    useSelector((s: GlobalState) => s.refreshWidgets);
export const useRefreshWidgetsDispatcher = () => useActions(refreshWidgets);
