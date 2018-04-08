import React from 'react';
import ExpenseForm from './ExpenseForm';

import routes from 'common/defs/routes';
import MainScreenCreator from '../common/MainScreenCreator';

import formToModel from './helpers/formToModel';
import getFormDefaults from './helpers/getFormDefaults';

const ExpenseCreator = () => (
    <MainScreenCreator
        getFormDefaults={getFormDefaults}
        formToModel={formToModel}
        formComponent={ExpenseForm}
        api={routes.expense}
        entityName="expense"
    />
);

export default ExpenseCreator;
