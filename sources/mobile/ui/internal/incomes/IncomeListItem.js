import React, {PureComponent} from 'react';
import MainScreenListItem from '../common/MainScreenListItem';
import IncomeListItemContent from './IncomeListItemContent';
import IncomeForm from './IncomeForm';

import modelToForm from './helpers/modelToForm';
import formToModel from './helpers/formToModel';

const IncomeListItem = (props) => (
    <MainScreenListItem
        entityName="income"
        nameProperty="description"
        editDialogProps={{
            modelToForm,
            formToModel,
            formComponent: IncomeForm
        }}
        contentComponent={IncomeListItemContent}
        {...props}
    />
);

export default IncomeListItem;
