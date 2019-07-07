// @flow
import type {TypeTransactionModel} from 'common/types';
import * as React from 'react';
import MoneyLocationDisplay from 'common/components/BaseTable/cells/MoneyLocationDisplay';
import AccountFilter from 'common/components/BaseTable/filters/AccountFilter';

const style = {textAlign: 'center'};

export default {
    Header: 'Account',
    filterable: true,
    Filter: AccountFilter,
    accessor: (item: TypeTransactionModel) => (
        <MoneyLocationDisplay item={item} />
    ),
    id: 'money_location_id',
    sortable: true,
    //
    headerStyle: style,
    style,
    width: 150,
};
