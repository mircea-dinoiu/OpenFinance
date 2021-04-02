import {Theme, useMediaQuery} from '@material-ui/core';
import {TransactionModel} from 'components/transactions/types';
import {theme} from 'defs/styles';
import moment from 'moment';
import * as React from 'react';

export const DateDisplay = ({item}: {item: TransactionModel}) => {
    const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    return (
        <span
            style={{
                fontSize: '1rem',
                color: isLarge ? 'inherit' : theme.palette.text.secondary,
            }}
            title={`Last updated: ${moment(item.updated_at).format('lll')}`}
        >
            {moment(item.created_at).format('lll')}
        </span>
    );
};
