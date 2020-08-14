import {RepeatsDisplay} from 'components/BaseTable/cells/RepeatsDisplay';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';

const style = {textAlign: 'center'};

export const RepeatColumn = {
    Header: 'Repeat',
    Cell: ({original: item}: {original: TransactionModel}) => (
        <RepeatsDisplay item={item} />
    ),
    accessor: 'repeat',
    sortable: false,
    //
    headerStyle: style,
    style,
    width: 130,
};
