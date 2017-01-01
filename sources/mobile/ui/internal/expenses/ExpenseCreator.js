import React, {PureComponent} from 'react';
import ExpenseForm from './ExpenseForm';

import routes from 'common/defs/routes';
import MainScreenCreator from '../common/MainScreenCreator';

import formToModel from './helpers/formToModel';
import getFormDefaults from './helpers/getFormDefaults';

const ExpenseCreator = (props) => {
    return (
        <MainScreenCreator
            getFormDefaults={getFormDefaults}
            formToModel={formToModel}
            formComponent={ExpenseForm}
            api={routes.expense}
            entityName="expense"
            {...props}
        />
    );
};

export default ExpenseCreator;