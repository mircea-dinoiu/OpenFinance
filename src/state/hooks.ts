import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import {refreshWidgets, setUsers} from 'state/actionCreators';
import {Bootstrap, GlobalState, Snackbar} from 'types';

export const useActions = <T>(actions: T): T => {
    const dispatch = useDispatch();

    // @ts-ignore
    return React.useMemo(() => bindActionCreators(actions, dispatch), [actions, dispatch]);
};
export const useBootstrap = (): Bootstrap => useSelector((s: GlobalState) => s.user);

export const useUsersWithActions = (): [
    Bootstrap,
    {
        setUsers: typeof setUsers;
    },
] => [
    useBootstrap(),
    useActions({
        setUsers,
    }),
];

export const useCategories = () => useSelector((s: GlobalState) => s.categories);
export const useSnackbars = (): Snackbar[] => useSelector((s: GlobalState) => s.snackbars);

export const useRefreshWidgets = () => useSelector((s: GlobalState) => s.refreshWidgets);
export const useRefreshWidgetsDispatcher = () => useActions(refreshWidgets);
