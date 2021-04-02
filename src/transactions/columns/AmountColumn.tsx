import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {AmountDisplay} from 'transactions/cells/AmountDisplay';

const style = {textAlign: 'right'};

export const AmountColumn = {
    Header: 'Amount',
    Cell: ({original: item}: {original: TransactionModel}) => <AmountDisplay item={item} />,
    accessor: 'sum',
    //
    width: 100,
    headerStyle: style,
    style,
};
