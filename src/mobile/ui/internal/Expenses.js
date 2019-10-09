// @ flow
import * as React from 'react';

import MainScreen from './common/MainScreen';

import List from './expenses/ExpenseList';

const Expenses = () => <MainScreen listComponent={List} />;

export default Expenses;
