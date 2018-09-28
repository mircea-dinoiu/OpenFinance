// @flow
import React from 'react';
import MoneyLocationDisplay from 'common/components/BaseTable/cells/MoneyLocationDisplay';
import AccountFilter from 'common/components/BaseTable/filters/AccountFilter';

const style = { textAlign: 'center' };

export default {
    Header: 'Account',
    filterable: true,
    Filter: AccountFilter,
    accessor: (item) => <MoneyLocationDisplay item={item} />,
    id: 'money_location_id',
    sortable: false,
    //
    headerStyle: style,
    style,
};
