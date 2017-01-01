import React, {PureComponent} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import ExpenseCreator from './expenses/ExpenseCreator';
import ExpenseList from './expenses/ExpenseList';

import AddIcon from 'material-ui/svg-icons/content/add';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';

export default class Expenses extends PureComponent {
    state = {
        newExpense: null
    };

    render() {
        return (
            <Tabs>
                <Tab icon={<AddIcon/>}>
                    <ExpenseCreator {...this.props} onReceiveNewExpense={expense => this.setState({newExpense: expense})}/>
                </Tab>
                <Tab icon={<ViewListIcon/>}>
                    <ExpenseList {...this.props} newExpense={this.state.newExpense}/>
                </Tab>
            </Tabs>
        );
    }
}