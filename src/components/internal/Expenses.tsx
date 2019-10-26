import * as React from 'react';

import MainScreen from './common/MainScreen';

import List from './expenses/ExpenseList';

export const Expenses = () => <MainScreen listComponent={List} />;
