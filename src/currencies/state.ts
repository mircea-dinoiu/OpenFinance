import {createAction, createReducer} from '@reduxjs/toolkit';
import {Api} from 'app/Api';
import {TCurrencies, TCurrencyMap} from 'currencies/defs';
import {Dispatch} from 'react';
import {useSelector} from 'react-redux';
import {GlobalState} from 'app/state/defs';
import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';

export enum CurrenciesAction {
    received = 'currencies/received',
}

export const currenciesReducer = createReducer<TCurrencies>(
    {
        map: {},
    },
    {
        [CurrenciesAction.received]: (
            state,
            {
                payload,
            }: {
                payload: TCurrencies;
            },
        ) => payload,
    },
);

export const receiveCurrencies = createAction<TCurrencyMap>(CurrenciesAction.received);
export const fetchCurrencies = (params: {update?: boolean} = Object.freeze({})) => async (
    dispatch: Dispatch<{type: string; payload: unknown}>,
) => {
    const currenciesResponse = await createXHR<TCurrencyMap>({
        url: makeUrl(Api.currencies, params),
    });

    dispatch(receiveCurrencies(currenciesResponse.data));
};
export const useCurrenciesMap = (): TCurrencyMap => useSelector((s: GlobalState) => s.currencies.map);
export const useCurrencies = (): TCurrencies => useSelector((s: GlobalState) => s.currencies);
