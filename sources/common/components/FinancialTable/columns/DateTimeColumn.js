// @flow
import React from 'react';
import DateDisplay from 'common/components/FinancialTable/cells/DateDisplay';

const style = {textAlign: 'center'};

export default {
    Header: 'Date & Time',
    accessor: (item) => <DateDisplay item={item} />,
    id: 'datetime',
    //
    className: 'msl__date-column',
    width: 200,
    headerStyle: style,
    style
};
