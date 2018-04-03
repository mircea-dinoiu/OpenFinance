import React from 'react';

import routes from 'common/defs/routes';

import ExpenseListItem from './ExpenseListItem';
import MainScreenList from '../common/MainScreenList';
import ExpenseHeader from 'mobile/ui/internal/expenses/ExpenseHeader';

const ExpenseList = () => {
    return (
        <MainScreenList
            api={routes.expense}
            listItemComponent={ExpenseListItem}
            headerComponent={ExpenseHeader}
        />
    )
};

export default ExpenseList;
