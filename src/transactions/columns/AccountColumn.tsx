import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {AccountDisplayById} from 'transactions/cells/AccountDisplayById';
import {AccountFilter} from 'transactions/filters/AccountFilter';

const style = {textAlign: 'center'};

export const AccountColumn = {
    Header: 'Account',
    filterable: true,
    Filter: AccountFilter,
    Cell: ({original: item}: {original: TransactionModel}) => <AccountDisplayById id={item.money_location_id} />,
    accessor: 'money_location_id',
    sortable: true,
    //
    headerStyle: style,
    style,
    width: 150,
};
