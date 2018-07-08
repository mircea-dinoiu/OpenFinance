// @flow
import React from 'react';

import routes from 'common/defs/routes';

import MainScreenList from '../common/MainScreenList';
import IncomeTableColumns from 'mobile/ui/internal/incomes/IncomeTableColumns';
import IncomeForm from 'mobile/ui/internal/incomes/IncomeForm';
import IncomeListItemContent from 'mobile/ui/internal/incomes/IncomeListItemContent';
import modelToForm from 'mobile/ui/internal/incomes/helpers/modelToForm';
import formToModel from 'mobile/ui/internal/incomes/helpers/formToModel';

const IncomeList = (props) => (
    <MainScreenList
        api={routes.income}
        tableColumns={IncomeTableColumns}
        entityName="income"
        nameProperty="description"
        editDialogProps={{
            modelToForm,
            formToModel,
            formComponent: IncomeForm,
        }}
        contentComponent={IncomeListItemContent}
        {...props}
    />
);

export default IncomeList;
