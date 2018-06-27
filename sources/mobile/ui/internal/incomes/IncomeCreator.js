import React from 'react';
import IncomeForm from './IncomeForm';

import routes from 'common/defs/routes';
import MainScreenCreator from '../common/MainScreenCreator';

import formToModel from './helpers/formToModel';
import getFormDefaults from './helpers/getFormDefaults';

const IncomeCreator = () => (
    <MainScreenCreator
        getFormDefaults={getFormDefaults}
        formToModel={formToModel}
        formComponent={IncomeForm}
        api={routes.income}
        entityName="income"
    />
);

export default IncomeCreator;
