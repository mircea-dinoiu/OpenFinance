import React from 'react';
import IncomeForm from './IncomeForm';

import routes from 'common/defs/routes';
import MainScreenCreatorDialog from '../common/MainScreenCreatorDialog';

import formToModel from './helpers/formToModel';
import getFormDefaults from './helpers/getFormDefaults';

const IncomeCreator = (props) => (
    <MainScreenCreatorDialog
        getFormDefaults={getFormDefaults}
        formToModel={formToModel}
        formComponent={IncomeForm}
        api={routes.income}
        entityName="income"
        {...props}
    />
);

export default IncomeCreator;
