import React, {PureComponent} from 'react';
import {Paper} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import Expenses from './internal/Expenses';

// import AccountBalance from 'material-ui/svg-icons/action/account-balance';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';

export default class Internal extends PureComponent {
    state = {
        selectedIndex: 0,
        tab: null
    };

    select = (index) => this.setState({selectedIndex: index, tab: this.createTab(index)});

    createTab(index) {
        if (index == 0) {
            return (
                <Expenses {...this.props}/>
            );
        } else {
            return (
                <div style={{
                    textAlign: 'center',
                    padding: '50px'
                }}>This section is not available yet.</div>
            )
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
                        {/*<BottomNavigationItem
                            label="Balance"
                            icon={<AccountBalance/>}
                            onTouchTap={() => this.select(0)}
                        />*/}
                        <BottomNavigationItem
                            label="Expenses"
                            icon={<TrendingDown/>}
                            onTouchTap={() => this.select(0)}
                        />
                        <BottomNavigationItem
                            label="Incomes"
                            icon={<TrendingUp/>}
                            onTouchTap={() => this.select(1)}
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        );
    }
}