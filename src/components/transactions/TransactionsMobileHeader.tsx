import {Fab, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconSummary from '@material-ui/icons/AccountBalance';
import AddIcon from '@material-ui/icons/Add';
import {TransactionsEndDatePicker} from 'components/transactions/TransactionsEndDatePicker';
import {TransactionsSearchField} from 'components/transactions/TransactionsSearchField';
import {ScreenQuery, spacingNormal, spacingSmall, stickyHeaderHeight} from 'defs/styles';
import React from 'react';

export const TransactionsMobileHeader = ({
    onTransactionAdd,
    onSummaryOpen,
}: {
    onTransactionAdd: () => void;
    onSummaryOpen: () => void;
}) => {
    const cls = useStyles();

    return (
        <Paper className={cls.paper} square={true}>
            <TransactionsEndDatePicker />
            <div className={cls.searchGrid}>
                <TransactionsSearchField />
                <Fab
                    variant="extended"
                    color="primary"
                    size="small"
                    onClick={onTransactionAdd}
                >
                    <AddIcon />
                </Fab>
                <Fab
                    variant="extended"
                    color="secondary"
                    size="small"
                    onClick={onSummaryOpen}
                >
                    <IconSummary />
                </Fab>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles({
    paper: {
        padding: spacingNormal,
        position: 'sticky',
        top: stickyHeaderHeight,
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'end',
        gridGap: spacingSmall,
        [ScreenQuery.SMALL]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto auto',
        },
    },
    searchGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gridGap: spacingSmall,
        alignItems: 'end',
    },
});
