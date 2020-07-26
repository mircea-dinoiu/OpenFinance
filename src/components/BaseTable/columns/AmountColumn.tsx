import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';

const style = {textAlign: 'right'};

export const AmountColumn = {
    Header: 'Amount',
    filterable: true,
    accessor: (item: TransactionModel) => (
        <AmountDisplay item={item} />
    ),
    id: 'sum',
    //
    width: 100,
    headerStyle: style,
    style,
};
