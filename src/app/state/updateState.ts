import {Action, GlobalState} from 'app/state/defs';

export const updateState = (state: Partial<GlobalState>) => ({
    type: Action.UPDATE_STATE,
    state,
});

