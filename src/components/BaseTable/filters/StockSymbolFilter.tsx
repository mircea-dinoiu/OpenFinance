import * as React from 'react';
import {useStocks} from 'domain/stocks/state';
import {SelectFilter, SelectFilterProps} from './SelectFilter';

export const StockSymbolFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter onChange={onChange} filter={filter} nameKey="symbol" allowNone={false} items={useStocks()} />
);
