import {createAction, createReducer} from '@reduxjs/toolkit';
import {Api} from 'defs/Api';
import {Stock} from 'domain/stocks/defs';
import {Dispatch} from 'react';
import {useSelector} from 'react-redux';
import {GlobalState} from 'state/defs';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

enum Action {
    received = 'stocks/received',
}

export const stocksReducer = createReducer<Stock[]>([], {
    [Action.received]: (
        state,
        {
            payload,
        }: {
            payload: Stock[];
        },
    ) => payload,
});

const receiveStocks = createAction<Stock[]>(Action.received);

export const fetchStocks = (params: {update?: boolean} = Object.freeze({})) => async (
    dispatch: Dispatch<{type: string; payload: unknown}>,
) => {
    const response = await createXHR<Stock[]>({
        url: makeUrl(Api.stocks, params),
    });

    dispatch(receiveStocks(response.data));
};

export const useStocks = (): Stock[] => useSelector((s: GlobalState) => s.stocks);
export const useStockPrices = (): Map<number, number> => {
    const stocks = useStocks();
    const map = new Map();

    for (const stock of stocks) {
        map.set(stock.id, stock.price);
    }

    return map;
};

export const useStocksMap = (): Map<number, Stock> => {
    const stocks = useStocks();
    const map = new Map();

    for (const stock of stocks) {
        map.set(stock.id, stock);
    }

    return map;
};
