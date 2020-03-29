import {Currencies, GlobalState, CurrenciesApi} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {routes} from 'defs/routes';
import {useSelector} from 'react-redux';
import {createAction, createReducer} from '@reduxjs/toolkit';
import {useActions} from 'state/hooks';
import {Dispatch} from 'react';

export enum CurrenciesAction {
    selectedIdSet = 'currencies/selectedId/set',
    received = 'currencies/received',
    drawerOpenSet = 'currencies/drawerOpen/set',
}

export const currencies = createReducer<Currencies>(null, {
    [CurrenciesAction.received]: (
        state,
        {
            payload,
        }: {
            payload: CurrenciesApi;
        },
    ) => ({
        ...payload.map,
        selected: payload.map[payload.default],
    }),
    [CurrenciesAction.selectedIdSet]: (
        state: Currencies,
        {payload}: {payload: number},
    ) => ({
        ...state,
        selected: state[payload],
    }),
});

export const setCurrenciesSelectedId = createAction<number>(
    CurrenciesAction.selectedIdSet,
);

export const receiveCurrencies = createAction<Currencies>(
    CurrenciesAction.received,
);
export const fetchCurrencies = (
    params: {update?: boolean} = Object.freeze({}),
) => async (dispatch: Dispatch<{type: string; payload: unknown}>) => {
    const currenciesResponse = await createXHR<Currencies>({
        url: makeUrl(routes.currencies, params),
    });

    dispatch(receiveCurrencies(currenciesResponse.data));
};
export const useCurrencies = (): Currencies =>
    useSelector((s: GlobalState) => s.currencies);

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
        useSelector((s: GlobalState) => s.currenciesDrawerOpen),
        useActions({setCurrenciesDrawerOpen}),
    ];
};
