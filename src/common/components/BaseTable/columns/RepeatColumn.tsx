import {TypeTransactionModel} from 'common/types';
import * as React from 'react';
import RepeatsDisplay from 'common/components/BaseTable/cells/RepeatsDisplay';

const style = {textAlign: 'center'};

export default {
    Header: 'Repeat',
    accessor: (item: TypeTransactionModel) => <RepeatsDisplay item={item} />,
    id: 'repeat',
    sortable: false,
    //
    headerStyle: style,
    style,
    width: 130,
};
