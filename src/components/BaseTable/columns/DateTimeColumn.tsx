import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {DateDisplay} from 'components/BaseTable/cells/DateDisplay';

const style = {textAlign: 'center'};

export const DateTimeColumn = {
    Header: 'Date & Time',
    Cell: ({original: item}: {original: TransactionModel}) => (
        <DateDisplay item={item} />
    ),
    accessor: 'created_at',
    defaultSortDesc: true,
    //
    width: 200,
    headerStyle: style,
    style,
};
