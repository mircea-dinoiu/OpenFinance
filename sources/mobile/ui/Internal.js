// @flow weak
import type {TypeScreenQueries} from 'common/types';
import React, {PureComponent} from 'react';
import {
    BottomNavigation,
    BottomNavigationAction,
    Tab,
    Tabs,
    AppBar,
    Paper,
} from '@material-ui/core';

import Expenses from './internal/Expenses';
import Summary from './internal/Summary';

import AccountBalance from '@material-ui/icons/AccountBalance';
import TrendingDown from '@material-ui/icons/TrendingDown';

import {connect} from 'react-redux';
import {Col, Row} from 'react-grid-system';
import {flexColumn} from 'common/defs/styles';
import {grey} from '@material-ui/core/colors';

type TypeProps = {
    screen: TypeScreenQueries,
};

type TypeState = {
    selectedIndex: number,
    tab: ?React$Element<any>,
};

class Internal extends PureComponent<TypeProps, TypeState> {
    state = {
        selectedIndex: 0,
        tab: null,
    };
    handleChangeTab = (index) => {
        this.setState({selectedIndex: index});
    };

    renderMobileTab(index) {
        switch (index) {
            case 0:
                return <Summary />;
            case 1:
                return <Expenses />;
        }

        return null;
    }

    renderDesktopTab(index) {
        switch (index) {
            case 0:
                return <Expenses />;
        }

        return this.renderComingSoon();
    }

    componentDidMount() {
        this.handleChangeTab(this.state.selectedIndex);
    }

    renderComingSoon() {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '100px',
                    fontSize: '48px',
                    color: grey[700],
                }}
            >
                Coming soon
            </div>
        );
    }

    shouldRenderExtraScreens() {
        return false;
    }

    renderLarge() {
        return (
            <Row nogutter>
                <Col xs={2} style={{paddingRight: 0}}>
                    <Summary />
                </Col>
                <Col xs={10} style={{paddingLeft: 0}}>
                    <AppBar position="static">
                        <Tabs
                            value={this.state.selectedIndex}
                            onChange={(event, index) =>
                                this.handleChangeTab(index)
                            }
                        >
                            <Tab label="Transactions" />
                            {this.shouldRenderExtraScreens() && (
                                <>
                                    <Tab label="Categories" />
                                    <Tab label="Accounts" />
                                    <Tab label="Account Types" />
                                </>
                            )}
                        </Tabs>
                    </AppBar>
                    {this.renderDesktopTab(this.state.selectedIndex)}
                </Col>
            </Row>
        );
    }

    renderMediumDown() {
        return (
            <div
                style={{
                    paddingBottom: '56px',
                }}
            >
                {this.renderMobileTab(this.state.selectedIndex)}
                <Paper
                    zDepth={1}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        zIndex: 1,
                        width: '100%',
                    }}
                >
                    <BottomNavigation value={this.state.selectedIndex}>
                        <BottomNavigationAction
                            label="Summary"
                            icon={<AccountBalance />}
                            onClick={() => this.handleChangeTab(0)}
                            onTouchTap={() => this.handleChangeTab(0)}
                        />
                        <BottomNavigationAction
                            label="Transactions"
                            icon={<TrendingDown />}
                            onClick={() => this.handleChangeTab(1)}
                            onTouchTap={() => this.handleChangeTab(1)}
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        );
    }

    render() {
        return (
            <div style={flexColumn}>
                {this.props.screen.isLarge
                    ? this.renderLarge()
                    : this.renderMediumDown()}
            </div>
        );
    }
}

export default connect(({screen}) => ({screen}))(Internal);
