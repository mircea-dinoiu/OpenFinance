import React from 'react';

import MainScreen from './common/MainScreen';

import Creator from './expenses/ExpenseCreator';
import List from './expenses/ExpenseList';

const Expenses = () => {
    return (
      <MainScreen listComponent={List} creatorComponent={Creator}/>
    );
};

export default Expenses;
