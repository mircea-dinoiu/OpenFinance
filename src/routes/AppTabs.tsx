import {BottomNavigation, BottomNavigationAction, Paper, Tab, Tabs} from '@material-ui/core';

import AccountBalance from '@material-ui/icons/AccountBalance';
import TrendingDown from '@material-ui/icons/TrendingDown';
import {Accounts} from 'components/accounts/Accounts';
import {AccountTypes} from 'components/accountTypes/AccountTypes';
import {Categories} from 'components/categories/Categories';

import {Expenses} from 'components/transactions/Expenses';
import {Summary} from 'components/transactions/Summary';
import {spacingSmall} from 'defs/styles';
import {paths} from 'js/defs';
import * as React from 'react';
import {Redirect, Route, useHistory, useLocation} from 'react-router-dom';
import {useScreenSize} from 'state/hooks';
import styled from 'styled-components';

const HomeMediumDown = () => {
    const history = useHistory();
    const location = useLocation();
    const tabs = [paths.transactionsSummary, paths.transactionsList];

    return (
        <div
            style={{
                paddingBottom: '56px',
            }}
        >
            <Redirect
                exact={true}
                from={paths.transactions}
                to={paths.transactionsSummary}
            />
            <Route
                path={paths.transactionsSummary}
                exact={true}
                render={() => (
                    <div style={{margin: spacingSmall}}>
                        <Summary />
                    </div>
                )}
            />
            <Route path={paths.transactionsList} component={Expenses} />
            <Paper
                elevation={1}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    zIndex: 1,
                    width: '100%',
                }}
            >
                <BottomNavigation value={tabs.indexOf(location.pathname)}>
                    <BottomNavigationAction
                        label="Summary"
                        icon={<AccountBalance />}
                        onClick={() => history.push(paths.transactionsSummary)}
                    />
                    <BottomNavigationAction
                        label="Transactions"
                        icon={<TrendingDown />}
                        onClick={() => history.push(paths.transactionsList)}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
};

const HomeLarge = () => {
    const history = useHistory();
    const location = useLocation();
    const tabs = [
        paths.transactions,
        paths.categories,
        paths.accounts,
        paths.accountTypes,
    ];

    return (
        <div style={{margin: spacingSmall}}>
            <Paper style={{marginBottom: spacingSmall}}>
                <Tabs
                    value={tabs.indexOf(location.pathname)}
                    onChange={(event, index) => history.push(tabs[index])}
                >
                    <Tab label="Transactions" />
                    <Tab label="Categories" />
                    <Tab label="Accounts" />
                    <Tab label="Account Types" />
                </Tabs>
            </Paper>
            <Route
                path={paths.transactions}
                render={() => (
                    <TransactionsContainer>
                        <Summary />
                        <TransactionsContentContainer>
                            <Expenses />
                        </TransactionsContentContainer>
                    </TransactionsContainer>
                )}
            />
            <Route path={paths.categories} component={Categories} />
            <Route path={paths.accounts} component={Accounts} />
            <Route path={paths.accountTypes} component={AccountTypes} />
        </div>
    );
};

export const AppTabs = () => {
    const screenSize = useScreenSize();

    return screenSize.isLarge ? <HomeLarge /> : <HomeMediumDown />;
};

const TransactionsContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 10fr;
    flex-grow: 1;
`;

const TransactionsContentContainer = styled.div`
    width: calc(100vw / 12 * 10);
    margin-left: ${spacingSmall};
`;