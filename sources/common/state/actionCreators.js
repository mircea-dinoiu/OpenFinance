// @flow
import {Actions} from 'common/state/actions';
import type {
    TypeSnackbar,
    TypeScreenQueries,
    TypePreferences,
    TypeDispatch,
    TypeCurrencies, TypeUsers, TypeGlobalState,
} from 'common/types';
import {createXHR} from 'common/utils/fetch';
import routes from 'common/defs/routes';
import {makeUrl} from 'common/utils/url';

export const updateState = (state: $Shape<TypeGlobalState>) => ({
    type: Actions.UPDATE_STATE,
    state,
});

export const updateUser = (user: null | TypeUsers) => ({
    type: Actions.UPDATE_USER,
    user,
});

export const toggleLoading = (value: boolean) => ({
    type: value ? Actions.LOADING_ENABLE : Actions.LOADING_DISABLE,
});

export const setScreen = (value: TypeScreenQueries) => ({
    type: Actions.SET_SCREEN,
    value,
});
export const updatePreferences = (value: $Shape<TypePreferences>) => ({
    type: Actions.UPDATE_PREFERENCES,
    value,
});
export const refreshWidgets = () => ({type: Actions.REFRESH_WIDGETS});

export const setBaseCurrencyId = (value: number) => ({
    type: Actions.SET_BASE_CURRENCY_ID,
    value,
});

export const updateCurrencies = (value: TypeCurrencies) => ({
    type: Actions.UPDATE_CURRENCIES,
    value,
});

export const fetchCurrencies = (
    params: {update?: boolean} = Object.freeze({}),
) => async (dispatch: TypeDispatch) => {
    const currenciesResponse = await createXHR<TypeCurrencies>({
        url: makeUrl(routes.getCurrencies, params),
    });

    dispatch(updateCurrencies(currenciesResponse.data));
};

export const showSnackbar = (value: TypeSnackbar) => ({
    type: Actions.SHOW_SNACKBAR,
    value,
});
export const hideSnackbar = (value: string) => ({
    type: Actions.HIDE_SNACKBAR,
    value,
});
