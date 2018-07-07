// @flow
import React from 'react';
import AmountDisplay from 'common/components/FinancialTable/cells/AmountDisplay';

const style = { textAlign: 'right' };

export default {
    Header: 'Amount',
    accessor: (item) => <AmountDisplay item={item} />,
    id: 'amount',
    //
    width: 100,
    headerStyle: style,
    style,
};
