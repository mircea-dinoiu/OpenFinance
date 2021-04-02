import {Fab, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import {TransactionsEndDatePicker} from 'components/transactions/TransactionsEndDatePicker';
import {TransactionsSearchField} from 'components/transactions/TransactionsSearchField';
import React from 'react';
import {stickyHeaderHeight} from 'styles/stickyHeaderHeight';

export const TransactionsMobileHeader = ({onTransactionAdd}: {onTransactionAdd: () => void}) => {
    const cls = useStyles();

    return (
        <Paper className={cls.paper} square={true}>
            <TransactionsEndDatePicker />
            <div className={cls.searchGrid}>
                <TransactionsSearchField />
                <Fab variant="extended" color="primary" size="small" onClick={onTransactionAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        position: 'sticky',
        top: stickyHeaderHeight,
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'end',
        gridGap: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto auto',
        },
    },
    searchGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gridGap: theme.spacing(1),
        alignItems: 'end',
    },
}));
