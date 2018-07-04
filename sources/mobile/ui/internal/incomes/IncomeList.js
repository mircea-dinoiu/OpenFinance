// @flow
import React from 'react';

import routes from 'common/defs/routes';

import IncomeListItem from './IncomeListItem';
import MainScreenList from '../common/MainScreenList';
import IncomeTableColumns from 'mobile/ui/internal/incomes/IncomeTableColumns';

const IncomeList = () => (
    <MainScreenList
        api={routes.income}
        listItemComponent={IncomeListItem}
        tableColumns={IncomeTableColumns}
    />
);

export default IncomeList;
