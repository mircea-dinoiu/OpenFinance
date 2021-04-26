import {Action, GlobalState} from 'app/state/defs';
import {useActions} from 'app/state/useActions';
import {setUsers} from 'app/users/state';
import {useSelector} from 'react-redux';
import {TBootstrap, TUser} from 'users/defs';

export const useBootstrap = (): TBootstrap => useSelector((s: GlobalState) => s.user);
export const useUsersWithActions = (): [
    TBootstrap,
    {
        setUsers: typeof setUsers;
    },
] => [
    useBootstrap(),
    useActions({
        setUsers,
    }),
];
export const useUser = () => useSelector((s: GlobalState) => s.user.user);
export const userReducer = (state: TUser | null = null, action: {type: Action; value: TUser}) =>
    action.type === Action.SET_USERS ? action.value : state;
