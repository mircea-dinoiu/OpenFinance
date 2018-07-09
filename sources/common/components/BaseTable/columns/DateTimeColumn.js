// @flow
import React from 'react';
import DateDisplay from 'common/components/BaseTable/cells/DateDisplay';

const style = { textAlign: 'center' };

export default {
    Header: 'Date & Time',
    accessor: (item) => <DateDisplay item={item} />,
    id: 'datetime',
    //
    width: 200,
    headerStyle: style,
    style,
};
