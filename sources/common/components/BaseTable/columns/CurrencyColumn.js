// @flow
import React from 'react';
import CurrencyISOCodeDisplay from 'common/components/BaseTable/cells/CurrencyISOCodeDisplay';

const style = { textAlign: 'center' };

export default {
    Header: 'Currency',
    accessor: (item) => <CurrencyISOCodeDisplay item={item} />,
    id: 'currency',
    //
    width: 80,
    headerStyle: style,
    style,
};
