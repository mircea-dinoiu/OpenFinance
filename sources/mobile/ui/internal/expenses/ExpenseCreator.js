import React from 'react';
import ExpenseForm from './ExpenseForm';

import routes from 'common/defs/routes';
import MainScreenCreatorDialog from '../common/MainScreenCreatorDialog';

import formToModel from './helpers/formToModel';
import getFormDefaults from './helpers/getFormDefaults';

const ExpenseCreator = (props) => (
    <MainScreenCreatorDialog
        getFormDefaults={getFormDefaults}
        formToModel={formToModel}
        formComponent={ExpenseForm}
        api={routes.expense}
        entityName="expense"
        {...props}
    />
);

export default ExpenseCreator;
