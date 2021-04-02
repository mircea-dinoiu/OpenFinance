import {RepeatsDisplay} from 'transactions/cells/RepeatsDisplay';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';

const style = {textAlign: 'center'};

export const RepeatColumn = {
    Header: 'Repeat',
    Cell: ({original: item}: {original: TransactionModel}) => <RepeatsDisplay item={item} />,
    accessor: 'repeat',
    sortable: false,
    //
    headerStyle: style,
    style,
    width: 170,
};
