import * as React from 'react';
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

import {Col, Row} from 'react-grid-system';
import {flexColumn} from 'defs/styles';
import {grey} from '@material-ui/core/colors';
import {useScreenSize} from 'state/hooks';

const Internal = () => {
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
                return <Expenses />;
        }

        return renderComingSoon();
    };

    const shouldRenderExtraScreens = () => false;

    const renderLarge = () => (
        <Row nogutter>
            <Col xs={2} style={{paddingRight: 0}}>
                <Summary />
            </Col>
            <Col xs={10} style={{paddingLeft: 0}}>
                <AppBar position="static">
                    <Tabs
                        value={selectedIndex}
                        onChange={(event, index) => setSelectedIndex(index)}
                    >
                        <Tab label="Transactions" />
                        {shouldRenderExtraScreens() && (
                            <>
                                <Tab label="Categories" />
                                <Tab label="Accounts" />
                                <Tab label="Account Types" />
                            </>
                        )}
                    </Tabs>
                </AppBar>
                {renderDesktopTab(selectedIndex)}
            </Col>
        </Row>
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

    return (
        <div style={flexColumn}>
            {screenSize.isLarge ? renderLarge() : renderMediumDown()}
        </div>
    );
};

export default Internal;
