import {TextField} from '@material-ui/core';
import {MuiSelectNative} from 'components/dropdowns';
import {TransactionForm} from 'components/transactions/types';
import {gridGap} from 'defs/styles';
import React from 'react';
import {useStocks} from 'state/stocks';
import styled from 'styled-components';

export const TransactionStockFields = ({
    values: {stockUnits, stockId},
    onChange,
}: {
    values: Pick<TransactionForm, 'stockUnits' | 'stockId'>;
    onChange: (values: Pick<TransactionForm, 'stockUnits' | 'stockId'>) => void;
}) => {
    const stocks = useStocks();
    const stockOptions = stocks.map((s) => ({
        value: s.id,
        label: s.symbol,
    }));

    return (
        <Styled>
            <TextField
                label="Stock Units"
                value={stockUnits}
                fullWidth={true}
                type="number"
                onChange={(event) =>
                    onChange({
                        stockId,
                        stockUnits: Number(event.target.value),
                    })
                }
            />
            <MuiSelectNative<number | null>
                label="Stock Symbol"
                isNullable={true}
                onChange={({value}) => onChange({stockId: value, stockUnits})}
                value={stockOptions.find((o) => o.value === stockId)}
                options={stockOptions}
            />
        </Styled>
    );
};

const Styled = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
    align-items: center;
`;
