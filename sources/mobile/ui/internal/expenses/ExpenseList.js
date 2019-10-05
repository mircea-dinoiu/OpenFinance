// @flow weak
import * as React from 'react';

import routes from 'common/defs/routes';

import MainScreenList from '../common/MainScreenList';
import ExpenseTableColumns from 'mobile/ui/internal/expenses/ExpenseTableColumns';
import ExpenseForm from 'mobile/ui/internal/expenses/ExpenseForm';
import ExpenseListItemContent from 'mobile/ui/internal/expenses/ExpenseListItemContent';
import formToModel from 'mobile/ui/internal/expenses/helpers/formToModel';
import modelToForm from 'mobile/ui/internal/expenses/helpers/modelToForm';
import getFormDefaults from './helpers/getFormDefaults';

const ExpenseList = (props: *) => (
    <MainScreenList
        api={routes.expense}
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

export default ExpenseList;
