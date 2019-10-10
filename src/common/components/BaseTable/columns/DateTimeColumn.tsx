import {TypeTransactionModel} from 'common/types';
import * as React from 'react';
import DateDisplay from 'common/components/BaseTable/cells/DateDisplay';

const style = {textAlign: 'center'};

export default {
    Header: 'Date & Time',
    accessor: (item: TypeTransactionModel) => <DateDisplay item={item} />,
    id: 'created_at',
    defaultSortDesc: true,
    //
    width: 200,
    headerStyle: style,
    style,
};
