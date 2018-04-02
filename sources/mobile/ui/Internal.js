// @flow
import React, {PureComponent} from 'react';
import {Paper, Tab, Tabs} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import Expenses from './internal/Expenses';
import Incomes from './internal/Incomes';
import Summary from './internal/Summary';

import AccountBalance from 'material-ui-icons/AccountBalance';
import TrendingUp from 'material-ui-icons/TrendingUp';
import TrendingDown from 'material-ui-icons/TrendingDown';

import {connect} from 'react-redux';
import {Col, Row} from 'react-grid-system';
import {flexColumn} from 'common/defs/styles';

type TypeProps = {
    screen: TypeScreenQueries,
};

type TypeState = {
    selectedIndex: number,
    tab: ?React$Element<any>
};

class Internal extends PureComponent<TypeProps, TypeState> {
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

    renderLarge() {
        return (
            <Row>
                <Col xs={2} style={{paddingRight: 0}}>
                    <Summary/>
                </Col>
                <Col xs={10} style={{paddingLeft: 0}}>
                    <Tabs>
                        <Tab label="Expenses">
                            <Expenses/>
                        </Tab>
                        <Tab label="Incomes">
                            <Incomes/>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        );
    }

    renderMediumDown() {
        return (
            <div style={{
                paddingBottom: '56px'
            }}>
                {this.state.tab}
                <Paper zDepth={1} style={{position: 'fixed', bottom: 0, zIndex: 1, width: '100%'}}>
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

    render() {
        return (
            <div style={flexColumn}>
                {this.props.screen.isLarge ? this.renderLarge() : this.renderMediumDown()}
            </div>
        );
    }
}

export default connect(({screen}) => ({screen}))(Internal);