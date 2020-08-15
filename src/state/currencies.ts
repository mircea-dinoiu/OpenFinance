import {createAction, createReducer} from '@reduxjs/toolkit';
import {routes} from 'defs/routes';
import {Dispatch} from 'react';
import {useSelector} from 'react-redux';
import {Currencies, CurrenciesApi, GlobalState} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export enum CurrenciesAction {
    received = 'currencies/received',
}

export const currencies = createReducer<Currencies | null>(null, {
    [CurrenciesAction.received]: (
        state,
        {
            payload,
        }: {
            payload: CurrenciesApi;
        },
    ) => payload.map,
});

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
