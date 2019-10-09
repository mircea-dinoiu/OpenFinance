// @ flow
import type {TypeTransactionModel} from 'common/types';
import * as React from 'react';
import AmountDisplay from 'common/components/BaseTable/cells/AmountDisplay';

const style = {textAlign: 'right'};

export default {
    Header: 'Sum',
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
