import * as React from 'react';
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Tab,
    Tabs,
} from '@material-ui/core';

import {Expenses} from './transactions/Expenses';
import {Summary} from './transactions/Summary';

import AccountBalance from '@material-ui/icons/AccountBalance';
import TrendingDown from '@material-ui/icons/TrendingDown';

import {grey} from '@material-ui/core/colors';
import {useScreenSize} from 'state/hooks';
import styled from 'styled-components';
import {spacingSmall} from 'defs/styles';

export const Dashboard = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const screenSize = useScreenSize();

    const renderMobileTab = (index) => {
        switch (index) {
            case 0:
                return <Summary />;
            case 1:
                return <Expenses />;
        }

        return null;
    };

    const renderComingSoon = () => (
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

    const renderDesktopTab = (index) => {
        switch (index) {
            case 0:
                return (
                    <TransactionsContainer>
                        <Summary />
                        <TransactionsContentContainer>
                            <Expenses />
                        </TransactionsContentContainer>
                    </TransactionsContainer>
                );
        }

        return renderComingSoon();
    };

    const shouldRenderExtraScreens = () => true;

    const renderLarge = () => (
        <>
            <Paper style={{marginBottom: spacingSmall}}>
                <Tabs
                    value={selectedIndex}
                    onChange={(event, index) => setSelectedIndex(index)}
                >
                    <Tab label="Transactions" />
                    {shouldRenderExtraScreens() && [
                        <Tab label="Categories" />,
                        <Tab label="Accounts" />,
                        <Tab label="Account Types" />,
                    ]}
                </Tabs>
            </Paper>
            {renderDesktopTab(selectedIndex)}
        </>
    );

    const renderMediumDown = () => (
        <div
            style={{
                paddingBottom: '56px',
            }}
        >
            {renderMobileTab(selectedIndex)}
            <Paper
                elevation={1}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    zIndex: 1,
                    width: '100%',
                }}
            >
                <BottomNavigation value={selectedIndex}>
                    <BottomNavigationAction
                        label="Summary"
                        icon={<AccountBalance />}
                        onClick={() => setSelectedIndex(0)}
                    />
                    <BottomNavigationAction
                        label="Transactions"
                        icon={<TrendingDown />}
                        onClick={() => setSelectedIndex(1)}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );

    return screenSize.isLarge ? renderLarge() : renderMediumDown();
};

const TransactionsContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 10fr;
    flex-grow: 1;
`;

const TransactionsContentContainer = styled.div`
    width: calc(100vw / 12 * 10);
`;
