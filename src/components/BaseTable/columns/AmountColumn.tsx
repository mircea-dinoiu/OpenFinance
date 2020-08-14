import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';

const style = {textAlign: 'right'};

export const AmountColumn = {
    Header: 'Amount',
    filterable: true,
    Cell: ({original: item}: {original: TransactionModel}) => (
        <AmountDisplay item={item} />
    ),
    accessor: 'sum',
    //
    width: 100,
    headerStyle: style,
    style,
};
