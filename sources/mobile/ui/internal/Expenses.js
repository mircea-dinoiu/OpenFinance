import React, {PureComponent} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import ExpenseCreator from './expenses/ExpenseCreator';
import ExpenseList from './expenses/ExpenseList';

export default class Expenses extends PureComponent {
    state = {
        newExpense: null
    };

    render() {
        return (
            <Tabs>
                <Tab label="Create Expense">
                    <ExpenseCreator {...this.props} onReceiveNewExpense={expense => this.setState({newExpense: expense})}/>
                </Tab>
                <Tab label="Expense List">
                    <ExpenseList {...this.props} newExpense={this.state.newExpense}/>
                </Tab>
            </Tabs>
        );
    }
}