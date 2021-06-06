import {Fab, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import {TransactionsSearchField} from 'transactions/TransactionsSearchField';
import React from 'react';
import {stickyHeaderHeight} from 'app/styles/stickyHeaderHeight';

export const TransactionsMobileHeader = ({onTransactionAdd}: {onTransactionAdd: () => void}) => {
    const cls = useStyles();

    return (
        <Paper className={cls.paper} square={true}>
            <TransactionsSearchField />
            <Fab variant="extended" color="primary" size="small" onClick={onTransactionAdd}>
                <AddIcon />
            </Fab>
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
        gridTemplateColumns: '1fr auto auto',
        gridGap: theme.spacing(1),
        alignItems: 'center',
    },
}));
