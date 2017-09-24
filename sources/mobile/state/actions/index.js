import {Actions} from 'mobile/state';

export const updateState = (state) => {
    return {
        type: Actions.UPDATE_STATE,
        state,
    };
};

export const updateUser = (user) => {
    return {
        type: Actions.UPDATE_USER,
        user,
    };
};

export const toggleLoading = (value) => {
    return {
        type: value ? Actions.LOADING_ENABLE : Actions.LOADING_DISABLE,
    }
};