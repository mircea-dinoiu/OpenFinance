import {Action} from 'app/state/defs';

const stateKeysWithoutReducers: string[] = [];

export const bindToUpdateState = <T extends object>(prop: string, defaultValue: T) => {
    stateKeysWithoutReducers.push(prop);

    return (
        state = defaultValue,
        action: {
            type: Action;
            state: T;
        },
    ) => {
        if (action.type === Action.UPDATE_STATE) {
            Object.keys(action.state).forEach((key) => {
                if (!stateKeysWithoutReducers.includes(key)) {
                    throw new Error(
                        `${key} has its own reducer. Please use action ${
                            Action.UPDATE_STATE
                        } only for ${stateKeysWithoutReducers.join(', ')}`,
                    );
                }
            });

            if (action.state.hasOwnProperty(prop)) {
                return action.state[prop];
            }
        }

        return state;
    };
};
