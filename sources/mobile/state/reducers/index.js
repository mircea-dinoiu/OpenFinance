import {fromJS} from 'immutable';
import {Actions} from 'mobile/state';

export const reducer = (state, action) => {
    switch (action.type) {
        case Actions.UPDATE_STATE:
            return {
                ...state,
                ...action.state,
            };
        case Actions.UPDATE_USER:
            return {...state, user: fromJS(action.user)};
        case Actions.LOADING_ENABLE:
            return {...state, loading: true}
        case Actions.LOADING_DISABLE:
            return {...state, loading: false}
    }

    return state;
};

