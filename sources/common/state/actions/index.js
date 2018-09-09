// @flow
import { Actions } from 'common/state';
import { createXHR } from 'common/utils/fetch';
import { fromJS } from 'immutable';
import routes from 'common/defs/routes';
import url from 'common/utils/url';

export const updateState = (state) => ({
    type: Actions.UPDATE_STATE,
    state,
});

export const updateUser = (user) => ({
    type: Actions.UPDATE_USER,
    user,
});

export const toggleLoading = (value) => ({
    type: value ? Actions.LOADING_ENABLE : Actions.LOADING_DISABLE,
});

export const setScreen = (value: TypeScreenQueries) => ({
    type: Actions.SET_SCREEN,
    value,
});
export const updatePreferences = (value: {}) => ({
    type: Actions.UPDATE_PREFERENCES,
    value,
});
export const refreshWidgets = () => ({ type: Actions.REFRESH_WIDGETS });

export const fetchCurrencies = (params = {}) => async (dispatch) => {
    const currenciesResponse = await createXHR({
        url: url(routes.getCurrencies, params),
    });

    dispatch(
        updateState({
            currencies: fromJS(currenciesResponse.data),
        }),
    );
};
