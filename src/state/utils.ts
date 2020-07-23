import {Action} from 'state/defs';

const stateKeysWithoutReducers: string[] = [];

export const bindToUpdateState = (prop, defaultValue) => {
    stateKeysWithoutReducers.push(prop);

    return (state = defaultValue, action) => {
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
