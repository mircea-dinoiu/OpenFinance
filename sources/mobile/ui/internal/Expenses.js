import React, {PureComponent} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ExpenseCreator from './expenses/ExpenseCreator';

export default class Expenses extends PureComponent {
    render() {
        return (
            <Tabs>
                <Tab label="Create Expense">
                    <ExpenseCreator {...this.props}/>
                </Tab>
                <Tab label="Expense List">
                    <div style={{
                        textAlign: 'center',
                        padding: '50px'
                    }}>
                        This section is not available yet.
                    </div>
                </Tab>
            </Tabs>
        );
    }
}