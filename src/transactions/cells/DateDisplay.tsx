import {styled} from '@material-ui/core';
import {TransactionModel} from 'transactions/defs';
import moment from 'moment';
import * as React from 'react';
import {EditableCell} from 'transactions/cells/EditableCell';

export const DateDisplay = ({item}: {item: TransactionModel}) => {
    return (
        <EditableCell id={item.id} field={'date'}>
            <StyledDateDisplay title={`Last updated: ${moment(item.updated_at).format('lll')}`}>
                {moment(item.created_at).format('lll')}
            </StyledDateDisplay>
        </EditableCell>
    );
};

const StyledDateDisplay = styled('span')(({theme}) => ({
    [theme.breakpoints.up('lg')]: {
        color: 'inherit',
    },
    [theme.breakpoints.down('md')]: {
        color: theme.palette.text.secondary,
    },
}));
