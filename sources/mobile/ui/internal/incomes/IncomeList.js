// @flow
import React from 'react';

import routes from 'common/defs/routes';

import IncomeListItem from './IncomeListItem';
import MainScreenList from '../common/MainScreenList';

const ExpenseList = () => {
    return (
        <MainScreenList
            api={routes.income}
            listItemComponent={IncomeListItem}
        />
    )
};

export default ExpenseList;
