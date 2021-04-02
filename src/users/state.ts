import {Bootstrap} from 'users/defs';
import {useSelector} from 'react-redux';
import {setUsers} from 'app/state/actionCreators';
import {GlobalState} from 'app/state/defs';
import {useActions} from 'app/state/hooks';

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
