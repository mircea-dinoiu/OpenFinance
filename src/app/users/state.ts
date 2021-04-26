import {Action} from 'app/state/defs';
import {TBootstrap} from 'users/defs';

export const setUsers = (users: null | TBootstrap) => ({
    type: Action.SET_USERS,
    value: users,
});
