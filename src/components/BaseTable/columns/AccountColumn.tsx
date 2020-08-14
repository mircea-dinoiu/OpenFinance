import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {MoneyLocationDisplay} from 'components/BaseTable/cells/MoneyLocationDisplay';
import {AccountFilter} from 'components/BaseTable/filters/AccountFilter';

const style = {textAlign: 'center'};

export const AccountColumn = {
    Header: 'Account',
    filterable: true,
    Filter: AccountFilter,
    Cell: ({original: item}: {original: TransactionModel}) => (
        <MoneyLocationDisplay id={item.money_location_id} />
    ),
    accessor: 'money_location_id',
    sortable: true,
    //
    headerStyle: style,
    style,
    width: 150,
};
