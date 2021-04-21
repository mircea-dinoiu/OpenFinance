import {styled} from '@material-ui/core';
import {TransactionModel} from 'transactions/defs';
import moment from 'moment';
import * as React from 'react';

export const DateDisplay = ({item}: {item: TransactionModel}) => {
    return (
        <StyledDateDisplay
            title={`Last updated: ${moment(item.updated_at).format('lll')}`}
        >
            {moment(item.created_at).format('lll')}
        </StyledDateDisplay>
    );
};

const StyledDateDisplay = styled('span')(({theme}) => ({
    fontSize: '1rem',
    [theme.breakpoints.up('lg')]: {
        color: 'inherit',
    },
    [theme.breakpoints.down('md')]: {
        color: theme.palette.text.secondary,
    },
}));
