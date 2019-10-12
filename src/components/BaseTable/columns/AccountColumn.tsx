import {TypeTransactionModel} from 'types';
import * as React from 'react';
import MoneyLocationDisplay from 'components/BaseTable/cells/MoneyLocationDisplay';
import AccountFilter from 'components/BaseTable/filters/AccountFilter';

const style = {textAlign: 'center'};

export default {
    Header: 'Account',
    filterable: true,
    Filter: AccountFilter,
    accessor: (item: TypeTransactionModel) => (
        <MoneyLocationDisplay id={item.money_location_id} />
    ),
    id: 'money_location_id',
    sortable: true,
    //
    headerStyle: style,
    style,
    width: 150,
};
