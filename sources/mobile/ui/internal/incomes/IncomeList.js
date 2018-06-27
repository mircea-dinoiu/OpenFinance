// @flow
import React from 'react';

import routes from 'common/defs/routes';

import IncomeListItem from './IncomeListItem';
import MainScreenList from '../common/MainScreenList';
import IncomeHeader from 'mobile/ui/internal/incomes/IncomeHeader';

const IncomeList = () => (
    <MainScreenList
        api={routes.income}
        listItemComponent={IncomeListItem}
        headerComponent={IncomeHeader}
    />
);

export default IncomeList;
