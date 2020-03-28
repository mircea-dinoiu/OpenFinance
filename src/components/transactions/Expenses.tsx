import * as React from 'react';

import {routes} from 'defs/routes';

import {MainScreenList} from 'components/transactions/MainScreenList';
import {ExpenseTableColumns} from 'components/transactions/ExpenseTableColumns';
import {ExpenseForm} from 'components/transactions/ExpenseForm';
import {ExpenseListItemContent} from 'components/transactions/ExpenseListItemContent';
import {formToModel} from 'components/transactions/transformers/formToModel';
import {modelToForm} from 'components/transactions/transformers/modelToForm';
import {getFormDefaults} from 'components/transactions/transformers/getFormDefaults';

export const Expenses = (props: {}) => (
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
