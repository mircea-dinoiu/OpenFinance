import React from 'react';

import MainScreen from './common/MainScreen';

import Creator from './incomes/IncomeCreator';
import List from './incomes/IncomeList';

const Incomes = (props) => {
    return (
      <MainScreen {...props} listComponent={List} creatorComponent={Creator}/>
    );
};

export default Incomes;
