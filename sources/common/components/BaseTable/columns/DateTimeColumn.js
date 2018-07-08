// @flow
import React from 'react';
import DateDisplay from 'common/components/BaseTable/cells/DateDisplay';
import cssTable from 'common/components/BaseTable/index.pcss';

const style = { textAlign: 'center' };

export default {
    Header: 'Date & Time',
    accessor: (item) => <DateDisplay item={item} />,
    id: 'datetime',
    //
    className: cssTable.dateColumn,
    width: 200,
    headerStyle: style,
    style,
};
