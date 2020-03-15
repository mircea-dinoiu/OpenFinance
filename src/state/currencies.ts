import {
    TypeCurrencies,
    TypeDispatch,
    TypeGlobalState,
    TypeCurrenciesApi,
} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {routes} from 'defs/routes';
import {useSelector} from 'react-redux';
import {createAction, createReducer} from '@reduxjs/toolkit';
import {useActions} from 'state/hooks';

export enum CurrenciesAction {
    selectedIdSet = 'currencies/selectedId/set',
    received = 'currencies/received',
    drawerOpenSet = 'currencies/drawerOpen/set',
}

export const currencies = createReducer<TypeCurrencies>(null, {
    [CurrenciesAction.received]: (
        state,
        {
            payload,
        }: {
            payload: TypeCurrenciesApi;
        },
    ) => ({
        ...payload.map,
        selected: payload.map[payload.default],
    }),
    [CurrenciesAction.selectedIdSet]: (
        state: TypeCurrencies,
        {payload}: {payload: number},
    ) => ({
        ...state,
        selected: state[payload],
    }),
});

export const setCurrenciesSelectedId = createAction<number>(
    CurrenciesAction.selectedIdSet,
);

export const receiveCurrencies = createAction<TypeCurrencies>(
    CurrenciesAction.received,
);
export const fetchCurrencies = (
    params: {update?: boolean} = Object.freeze({}),
) => async (dispatch: TypeDispatch) => {
    const currenciesResponse = await createXHR<TypeCurrencies>({
        url: makeUrl(routes.currencies, params),
    });

    dispatch(receiveCurrencies(currenciesResponse.data));
};
export const useCurrencies = (): TypeCurrencies =>
    useSelector((s: TypeGlobalState) => s.currencies);

/**
 * currenciesDrawerOpen
 */
export const currenciesDrawerOpen = createReducer(false, {
    [CurrenciesAction.drawerOpenSet]: (
        prevState: boolean,
        action: {payload: boolean},
    ) => action.payload,
});

const setCurrenciesDrawerOpen = createAction<boolean>(
    CurrenciesAction.drawerOpenSet,
);

export const useCurrenciesDrawerOpenWithActions = (): [
    boolean,
    {setCurrenciesDrawerOpen: typeof setCurrenciesDrawerOpen},
] => {
    return [
        useSelector((s: TypeGlobalState) => s.currenciesDrawerOpen),
        useActions({setCurrenciesDrawerOpen}),
    ];
};
