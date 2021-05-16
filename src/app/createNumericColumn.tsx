import {Column} from 'react-table-6';
import {NumericValue} from 'app/formatters';
import React, {ReactNode} from 'react';
import {numericColumnStyles} from 'app/styles/column';
import {GridColDef} from '@material-ui/x-grid';

export const createNumericColumn = <T extends {currency_id: number}>(
    column: Column<T>,
    {
        colorize = true,
        after,
    }: {
        colorize?: boolean;
        after?: ReactNode;
    } = {},
) => {
    const ret: Column<T> = {
        Cell: ({original, value}: {original: T; value: number}) => {
            return (
                value != null && (
                    <NumericValue
                        variant="tableCell"
                        colorize={colorize}
                        after={after}
                        currency={original.currency_id}
                        value={value}
                    />
                )
            );
        },
        ...numericColumnStyles,
        ...column,
    };

    return ret;
};

export const createNumericColumnX = <T extends {currency_id: number}>(
    column: GridColDef,
    {
        colorize = true,
        after,
    }: {
        colorize?: boolean;
        after?: ReactNode;
    } = {},
) => {
    const ret: GridColDef = {
        renderCell: (params) => {
            const value = column.valueGetter ? column.valueGetter(params) : params.value;

            return (
                <>
                    {value != null && (
                        <NumericValue
                            variant="gridCell"
                            colorize={colorize}
                            after={after}
                            currency={params.row.currency_id}
                            value={value as number}
                        />
                    )}
                </>
            );
        },
        width: 150,
        align: 'right',
        headerAlign: 'right',
        ...column,
    };

    return ret;
};
