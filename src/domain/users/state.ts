import {Bootstrap} from 'domain/users/defs';
import {useSelector} from 'react-redux';
import {setUsers} from 'state/actionCreators';
import {useActions} from 'state/hooks';
import {GlobalState} from 'types';

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
