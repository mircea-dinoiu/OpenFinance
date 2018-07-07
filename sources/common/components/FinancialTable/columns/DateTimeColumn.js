// @flow
import React from 'react';
import DateDisplay from 'common/components/FinancialTable/cells/DateDisplay';
import cssTable from 'common/components/FinancialTable/index.pcss';

const style = {textAlign: 'center'};

export default {
    Header: 'Date & Time',
    accessor: (item) => <DateDisplay item={item} />,
    id: 'datetime',
    //
    className: cssTable.dateColumn,
    width: 200,
    headerStyle: style,
    style
};
