import {Button, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {SmartDrawer} from 'components/drawers';
import {MainScreenList} from 'components/transactions/MainScreenList';
import {Summary} from 'components/transactions/Summary';
import {spacingSmall} from 'defs/styles';
import * as React from 'react';
import {useState} from 'react';
import {useScreenSize} from 'state/hooks';
import styled from 'styled-components';

export const TransactionsSummaryCombo = () => {
    const screenSize = useScreenSize();
    const [summaryIsPinned, setSummaryIsPinned] = useState(true);
    const cls = useStyles();
    const [summaryIsOpen, setSummaryIsOpen] = useState(false);



    if (screenSize.isLarge) {
        return (
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
                            onClick={() => setSummaryIsPinned(!summaryIsPinned)}
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
                    <MainScreenList />
                </div>
            </TransactionsContainer>
        );
    }

    return (
        <>
            <SmartDrawer
                open={summaryIsOpen}
                onClose={() => setSummaryIsOpen(false)}
            >
                <div className={cls.summaryContainer}>
                    <Summary />
                </div>
            </SmartDrawer>
            <MainScreenList onSummaryOpen={() => setSummaryIsOpen(true)} />
        </>
    );
};

const TransactionsContainer = styled.div`
    flex-grow: 1;
`;

const sidebarWidth = 400;
const sidebarCollapsedWidth = 50;
const gapWidth = 15;

const useStyles = makeStyles({
    summaryContainer: {
        padding: spacingSmall,
    },
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

