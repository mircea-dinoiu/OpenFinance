import {createAction, createReducer} from '@reduxjs/toolkit';
import {Api} from 'app/Api';
import {Currencies, CurrencyMap} from 'currencies/defs';
import {Dispatch} from 'react';
import {useSelector} from 'react-redux';
import {GlobalState} from 'app/state/defs';
import {createXHR} from 'app/utils/fetch';
import {makeUrl} from 'app/utils/url';

export enum CurrenciesAction {
    received = 'currencies/received',
}

export const currenciesReducer = createReducer<Currencies>(
    {
        map: {},
    },
    {
        [CurrenciesAction.received]: (
            state,
            {
                payload,
            }: {
                payload: Currencies;
            },
        ) => payload,
    },
);

export const receiveCurrencies = createAction<CurrencyMap>(CurrenciesAction.received);
export const fetchCurrencies = (params: {update?: boolean} = Object.freeze({})) => async (
    dispatch: Dispatch<{type: string; payload: unknown}>,
) => {
    const currenciesResponse = await createXHR<CurrencyMap>({
        url: makeUrl(Api.currencies, params),
    });

    dispatch(receiveCurrencies(currenciesResponse.data));
};
export const useCurrenciesMap = (): CurrencyMap => useSelector((s: GlobalState) => s.currencies.map);
export const useCurrencies = (): Currencies => useSelector((s: GlobalState) => s.currencies);
