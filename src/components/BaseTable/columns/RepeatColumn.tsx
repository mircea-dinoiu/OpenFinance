import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {RepeatsDisplay} from 'components/BaseTable/cells/RepeatsDisplay';

const style = {textAlign: 'center'};

export const RepeatColumn = {
    Header: 'Repeat',
    accessor: (item: TransactionModel) => <RepeatsDisplay item={item} />,
    id: 'repeat',
    sortable: false,
    //
    headerStyle: style,
    style,
    width: 130,
};
