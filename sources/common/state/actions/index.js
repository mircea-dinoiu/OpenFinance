import {Actions} from 'common/state';

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

export const setScreen = (value: TypeScreenQueries) => ({type: Actions.SET_SCREEN, value});
export const setEndDate = (value: string | Date) => ({type: Actions.SET_END_DATE, value});
export const refreshWidgets = () => ({type: Actions.REFRESH_WIDGETS});