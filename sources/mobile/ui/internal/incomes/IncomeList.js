// @flow
import React from 'react';

import routes from 'common/defs/routes';

import IncomeListItem from './IncomeListItem';
import MainScreenList from '../common/MainScreenList';
import ExpenseHeader from 'mobile/ui/internal/expenses/ExpenseHeader';

const IncomeList = () => {
    return (
        <MainScreenList
            api={routes.income}
            listItemComponent={IncomeListItem}
            headerComponent={ExpenseHeader}
        />
    )
};

export default IncomeList;
