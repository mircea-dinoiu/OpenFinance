import {TransactionModel} from 'types';
import * as React from 'react';
import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';

const style = {textAlign: 'right'};

export const AmountColumn = {
    Header: 'Amount',
    filterable: true,
    accessor: (item: TransactionModel) => (
        <AmountDisplay showCurrency={false} item={item} />
    ),
    id: 'sum',
    //
    width: 100,
    headerStyle: style,
    style,
};
