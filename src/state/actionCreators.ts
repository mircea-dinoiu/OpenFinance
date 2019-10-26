import {Actions} from 'state/actions';
import {
    TypeCurrencies,
    TypeDispatch,
    TypeGlobalState,
    TypePreferences,
    TypeScreenQueries,
    TypeSnackbar,
    TypeUsers,
} from 'types';
import {createXHR} from 'utils/fetch';
import {routes} from 'defs/routes';
import {makeUrl} from 'utils/url';

export const updateState = (state: Partial<TypeGlobalState>) => ({
    type: Actions.UPDATE_STATE,
    state,
});

export const setUsers = (users: null | TypeUsers) => ({
    type: Actions.SET_USERS,
    value: users,
});

export const setScreen = (value: TypeScreenQueries) => ({
    type: Actions.SET_SCREEN,
    value,
});
export const updatePreferences = (value: Partial<TypePreferences>) => ({
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
        url: makeUrl(routes.currencies, params),
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
