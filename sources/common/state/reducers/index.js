import {fromJS} from 'immutable';
import {Actions} from 'common/state';
import {uniqueId} from 'lodash';

export const reducer = (state, action) => {
    switch (action.type) {
        case Actions.UPDATE_STATE:
            return {
                ...state,
                ...action.state,
            };
        case Actions.UPDATE_USER:
            return {...state, user: fromJS(action.user)};
        case Actions.SET_SCREEN:
            return {...state, screen: action.value};
        case Actions.LOADING_ENABLE:
            return {...state, loading: true};
        case Actions.SET_END_DATE:
            return {...state, endDate: action.value};
        case Actions.REFRESH_WIDGETS:
            return {...state, refreshWidgets: uniqueId()};
        case Actions.LOADING_DISABLE:
            return {...state, loading: false}
    }

    return state;
};

