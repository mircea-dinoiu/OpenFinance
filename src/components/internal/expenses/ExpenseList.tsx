import * as React from 'react';

import routes from 'defs/routes';

import MainScreenList from '../common/MainScreenList';
import ExpenseTableColumns from 'components/internal/expenses/ExpenseTableColumns';
import ExpenseForm from 'components/internal/expenses/ExpenseForm';
import ExpenseListItemContent from 'components/internal/expenses/ExpenseListItemContent';
import formToModel from 'components/internal/expenses/helpers/formToModel';
import modelToForm from 'components/internal/expenses/helpers/modelToForm';
import getFormDefaults from './helpers/getFormDefaults';

export const ExpenseList = (props: {}) => (
    <MainScreenList
        api={routes.transactions}
        tableColumns={ExpenseTableColumns}
        entityName="transaction"
        nameProperty="item"
        crudProps={{
            getFormDefaults,
            modelToForm,
            formToModel,
            formComponent: ExpenseForm,
        }}
        contentComponent={ExpenseListItemContent}
        {...props}
    />
);
