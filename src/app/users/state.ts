import {Action} from 'app/state/defs';
import {Bootstrap} from 'users/defs';

export const setUsers = (users: null | Bootstrap) => ({
    type: Action.SET_USERS,
    value: users,
});
