import {fromJS} from 'immutable';
import {Actions} from 'common/state';
import {uniqueId} from 'lodash';
import getScreenQueries from 'common/utils/getScreenQueries';
import {combineReducers} from 'redux';
import {getInitialEndDate} from 'common/utils/dates';
import {PREFERENCE_END_DATE, setPreference} from 'common/utils/preferences';

const stateKeysWithoutReducers = [];

const screen = (state = getScreenQueries(), action) => {
    return action.type === Actions.SET_SCREEN ? action.value : state;
};

const refreshWidgets = (state = uniqueId(), action) => {
    return action.type === Actions.REFRESH_WIDGETS ? uniqueId() : state;
};

const bindToUpdateState = (prop, defaultValue) => {
    stateKeysWithoutReducers.push(prop);

    return (state = defaultValue, action) => {
        if (action.type === Actions.UPDATE_STATE) {
            Object.keys(action.state).forEach(key => {
                if (!stateKeysWithoutReducers.includes(key)) {
                    throw new Error(
                        `${key} has its own reducer. Please use action ${Actions.UPDATE_STATE} only for ${stateKeysWithoutReducers.join(', ')}`
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

const user = (state = null, action) => (
    action.type === Actions.UPDATE_USER ? fromJS(action.user) : state
);

const loading = (state = true, action) => {
    if (action.type === Actions.LOADING_ENABLE) {
        return true;
    }

    if (action.type === Actions.LOADING_DISABLE) {
        return false;
    }

    return state;
};

const endDate = (state = getInitialEndDate(), action) => {
    if (action.type === Actions.SET_END_DATE) {
        setPreference(PREFERENCE_END_DATE, action.value);
        
        return action.value;
    }
    
    return state;
};

const title = bindToUpdateState('title', 'Loading...');
const ui = bindToUpdateState('ui', null);
const currenciesDrawerOpen = bindToUpdateState('currenciesDrawerOpen', false);
const currencies = bindToUpdateState('currencies', null);
const categories = bindToUpdateState('categories', null);
const moneyLocations = bindToUpdateState('moneyLocations', null);
const moneyLocationTypes = bindToUpdateState('moneyLocationTypes', null);

export const reducer = combineReducers({
    screen,
    title,
    loading,
    endDate,
    ui,
    currenciesDrawerOpen,
    refreshWidgets,
    user,
    currencies,
    categories,
    moneyLocations,
    moneyLocationTypes,
});