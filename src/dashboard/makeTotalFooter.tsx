import {NumericValue} from 'app/formatters';
import React from 'react';
import {CashAccount} from 'dashboard/defs';

export const makeTotalFooter = ({colorize}: {colorize?: boolean} = {}) => ({
    data,
    column,
}: {
    data: {_original: CashAccount}[];
    column: {id: string};
}) => {
    return data[0] ? (
        <NumericValue
            isExpanded={true}
            colorize={colorize}
            // eslint-disable-next-line no-underscore-dangle
            currency={Number(data[0]._original.currency_id)}
            before="Total: "
            value={data.reduce((acc, row) => acc + row[column.id], 0)}
        />
    ) : null;
};
