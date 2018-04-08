import React from 'react';
import MainScreenListItem from '../common/MainScreenListItem';
import ExpenseListItemContent from './ExpenseListItemContent';
import ExpenseForm from './ExpenseForm';

import modelToForm from './helpers/modelToForm';
import formToModel from './helpers/formToModel';

const ExpenseListItem = (props) => (
    <MainScreenListItem
        entityName="expense"
        nameProperty="item"
        editDialogProps={{
            modelToForm,
            formToModel,
            formComponent: ExpenseForm
        }}
        contentComponent={ExpenseListItemContent}
        {...props}
    />
);

export default ExpenseListItem;
