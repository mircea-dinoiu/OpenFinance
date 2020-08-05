import {
    BottomNavigation,
    BottomNavigationAction,
    Button,
    Paper,
    Tab,
    Tabs,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import AccountBalance from '@material-ui/icons/AccountBalance';
import TrendingDown from '@material-ui/icons/TrendingDown';
import clsx from 'clsx';
import {Accounts} from 'components/accounts/Accounts';
import {AccountTypes} from 'components/accountTypes/AccountTypes';
import {Categories} from 'components/categories/Categories';

import {Expenses} from 'components/transactions/Expenses';
import {Summary} from 'components/transactions/Summary';
import {spacingSmall} from 'defs/styles';
import {paths} from 'js/defs';
import {useState} from 'react';
import * as React from 'react';
import {Redirect, Route, useHistory, useLocation} from 'react-router-dom';
import {useScreenSize} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import styled from 'styled-components';
import {makeUrl} from 'utils/url';

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
                elevation={9}
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
    const project = useSelectedProject();
    const tabs = [
        paths.transactions,
        paths.categories,
        paths.accounts,
        paths.accountTypes,
    ];
    const [summaryIsPinned, setSummaryIsPinned] = useState(true);
    const cls = useStyles();

    return (
        <div style={{margin: spacingSmall}}>
            <Paper style={{marginBottom: spacingSmall}}>
                <Tabs
                    value={tabs.indexOf(location.pathname)}
                    onChange={(event, index) => {
                        history.push(
                            makeUrl(tabs[index], {projectId: project.id}),
                        );
                    }}
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
                        <Paper
                            className={clsx(
                                cls.summaryFloating,
                                summaryIsPinned && cls.summaryFloatingPinned,
                            )}
                            elevation={10}
                        >
                            <div className={cls.pinContainer}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                        setSummaryIsPinned(!summaryIsPinned)
                                    }
                                >
                                    {summaryIsPinned ? 'Unpin' : 'Pin'}
                                </Button>
                            </div>
                            <Summary />
                        </Paper>
                        <div
                            className={clsx(
                                cls.transactionsContentContainer,
                                summaryIsPinned &&
                                    cls.transactionsContentContainerPinned,
                            )}
                        >
                            <Expenses />
                        </div>
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
    flex-grow: 1;
`;

const sidebarWidth = 400;
const sidebarCollapsedWidth = 50;
const gapWidth = 15;

const useStyles = makeStyles({
    summaryFloating: {
        width: `${sidebarWidth}px`,
        position: 'absolute',
        transform: `translateX(-${sidebarWidth - sidebarCollapsedWidth}px)`,
        zIndex: 2,
        transition: 'all 0.5s',
        '&:hover': {
            transform: 'translateX(0)',
        },
        padding: spacingSmall,
    },
    summaryFloatingPinned: {
        transform: 'translateX(0)',
    },
    pinContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    transactionsContentContainer: {
        transition: 'all 0.5s',
        paddingLeft: `${sidebarCollapsedWidth + gapWidth}px`,
    },
    transactionsContentContainerPinned: {
        paddingLeft: `${sidebarWidth + gapWidth}px`,
    },
});
