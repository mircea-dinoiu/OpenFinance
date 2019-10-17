import {TypeTransactionModel} from 'types';
import * as React from 'react';
import AmountDisplay from 'components/BaseTable/cells/AmountDisplay';

const style = {textAlign: 'right'};

export default {
    Header: 'Amount',
    filterable: true,
    accessor: (item: TypeTransactionModel) => (
        <AmountDisplay showCurrency={false} item={item} />
    ),
    id: 'sum',
    //
    width: 100,
    headerStyle: style,
    style,
};
