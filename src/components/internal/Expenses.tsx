import * as React from 'react';

import {MainScreen} from './common/MainScreen';

import {ExpenseList} from './expenses/ExpenseList';

export const Expenses = () => <MainScreen listComponent={ExpenseList} />;
