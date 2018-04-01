import React, {PureComponent} from 'react';
import {Paper} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import Expenses from './internal/Expenses';
import Incomes from './internal/Incomes';
import Summary from './internal/Summary';

import AccountBalance from 'material-ui-icons/AccountBalance';
import TrendingUp from 'material-ui-icons/TrendingUp';
import TrendingDown from 'material-ui-icons/TrendingDown';

export default class Internal extends PureComponent {
    state = {
        selectedIndex: 1,
        tab: null
    };

    select = (index) => this.setState({selectedIndex: index, tab: this.createTab(index)});

    createTab(index) {
        switch (index) {
            case 0:
                return (
                    <Summary/>
                );
            case 1:
                return (
                    <Expenses/>
                );
            case 2:
                return (
                    <Incomes/>
                );
        }
    }

    componentDidMount() {
        this.select(this.state.selectedIndex);
    }

    render() {
        return (
            <div style={{
                paddingBottom: '56px'
            }}>
                {this.state.tab}
                <Paper zDepth={1} style={{position: 'fixed', bottom: 0, zIndex: 1}}>
                    <BottomNavigation selectedIndex={this.state.selectedIndex}>
                        <BottomNavigationItem
                            label="Summary"
                            icon={<AccountBalance/>}
                            onTouchTap={() => this.select(0)}
                        />
                        <BottomNavigationItem
                            label="Expenses"
                            icon={<TrendingDown/>}
                            onTouchTap={() => this.select(1)}
                        />
                        <BottomNavigationItem
                            label="Incomes"
                            icon={<TrendingUp/>}
                            onTouchTap={() => this.select(2)}
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        );
    }
}