import {TransactionForm} from 'transactions/defs';
import {Stock} from 'stocks/defs';
import React from 'react';
import {useStocks} from 'stocks/state';
import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';

export const TransactionStockFields = ({
    values: {stockId},
    onChange,
}: {
    values: Pick<TransactionForm, 'stockId'>;
    onChange: (values: Pick<TransactionForm, 'stockId'>) => void;
}) => {
    const stocks = useStocks();

    return (
        <Autocomplete<Stock>
            options={stocks}
            getOptionLabel={(o) => o.symbol}
            onChange={(e: unknown, value: Stock | null) => onChange({stockId: value?.id ?? null})}
            value={stocks.find((s) => s.id === stockId)}
            renderInput={(params) => <TextField {...params} label="Stock Symbol" InputLabelProps={{shrink: true}} />}
        />
    );
};
