// @flow
import React from 'react';
import AmountDisplay from 'common/components/BaseTable/cells/AmountDisplay';

const style = { textAlign: 'right' };

export default {
    Header: 'Amount',
    filterable: true,
    accessor: (item) => <AmountDisplay item={item} />,
    id: 'sum',
    //
    width: 130,
    headerStyle: style,
    style,
};
