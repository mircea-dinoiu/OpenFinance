import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {DateDisplay} from 'transactions/cells/DateDisplay';

const style = {textAlign: 'center'};

export const DateTimeColumn = {
    Header: 'Date & Time',
    Cell: ({original: item}: {original: TransactionModel}) => <DateDisplay item={item} />,
    accessor: 'created_at',
    defaultSortDesc: true,
    //
    width: 200,
    headerStyle: style,
    style,
};
