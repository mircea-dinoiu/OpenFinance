import {Action, GlobalState} from 'app/state/defs';
import {useActions} from 'app/state/useActions';
import {setUsers} from 'app/users/state';
import {useSelector} from 'react-redux';
import {Bootstrap, User} from 'users/defs';

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
export const userReducer = (state: User | null = null, action: {type: Action; value: User}) =>
    action.type === Action.SET_USERS ? action.value : state;
