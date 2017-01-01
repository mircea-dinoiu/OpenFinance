import React, {PureComponent} from 'react';

import routes from 'common/defs/routes';

import IncomeListItem from './IncomeListItem';
import MainScreenList from '../common/MainScreenList';

const ExpenseList = (props) => {
    return (
        <MainScreenList
            {...props}
            api={routes.income}
            listItemComponent={IncomeListItem}
        />
    )
};

export default ExpenseList;
