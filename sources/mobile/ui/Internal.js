import React, {PureComponent} from 'react';
import {Paper} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import Expenses from './internal/Expenses';
import Incomes from './internal/Incomes';
import Summary from './internal/Summary';

import AccountBalance from 'material-ui/svg-icons/action/account-balance';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';

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
                    <Summary {...this.props}/>
                );
            case 1:
                return (
                    <Expenses {...this.props}/>
                );
            case 2:
                return (
                    <Incomes {...this.props}/>
                );
        }
    }

    componentDidMount() {
        this.select(this.state.selectedIndex);
    }

    render() {
        return (
            <div>
                <div style={{
                    height: 'calc(100vh - 56px - 64px)',
                    overflowY: 'scroll',
                    WebkitOverflowScrolling: 'touch'
                }}>
                    {this.state.tab}
                </div>
                <Paper zDepth={1}>
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