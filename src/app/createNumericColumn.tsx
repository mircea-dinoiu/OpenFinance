import {Column} from 'react-table-6';
import {NumericValue} from 'app/formatters';
import React, {ReactNode} from 'react';
import {numericColumnStyles} from 'app/styles/column';

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
                        isExpanded={true}
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
