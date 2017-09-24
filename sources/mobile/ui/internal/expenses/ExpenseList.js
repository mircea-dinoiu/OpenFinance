import React from 'react';

import routes from 'common/defs/routes';

import ExpenseListItem from './ExpenseListItem';
import MainScreenList from '../common/MainScreenList';

const ExpenseList = () => {
    return (
        <MainScreenList
            api={routes.expense}
            listItemComponent={ExpenseListItem}
        />
    )
};

export default ExpenseList;
