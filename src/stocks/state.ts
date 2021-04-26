import {createAction, createReducer} from '@reduxjs/toolkit';
import {Api} from 'app/Api';
import {TStock} from 'stocks/defs';
import {Dispatch} from 'react';
import {useSelector} from 'react-redux';
import {GlobalState} from 'app/state/defs';
import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';

enum Action {
    received = 'stocks/received',
}

export const stocksReducer = createReducer<TStock[]>([], {
    [Action.received]: (
        state,
        {
            payload,
        }: {
            payload: TStock[];
        },
    ) => payload,
});

const receiveStocks = createAction<TStock[]>(Action.received);

export const fetchStocks = (params: {update?: boolean} = Object.freeze({})) => async (
    dispatch: Dispatch<{type: string; payload: unknown}>,
) => {
    const response = await createXHR<TStock[]>({
        url: makeUrl(Api.stocks, params),
    });

    dispatch(receiveStocks(response.data));
};

export const useStocks = (): TStock[] => useSelector((s: GlobalState) => s.stocks);
export const useStockPrices = (): Map<number, number> => {
    const stocks = useStocks();
    const map = new Map();

    for (const stock of stocks) {
        map.set(stock.id, stock.price);
    }

    return map;
};

export const useStocksMap = (): Map<number, TStock> => {
    const stocks = useStocks();
    const map = new Map();

    for (const stock of stocks) {
        map.set(stock.id, stock);
    }

    return map;
};
