import {TransactionModel} from 'components/transactions/types';
import moment from 'moment';
import * as React from 'react';
import {useScreenSize} from 'state/hooks';
import {theme} from 'defs/styles';

export const DateDisplay = ({item}: {item: TransactionModel}) => {
    const screen = useScreenSize();

    return (
        <span
            style={{
                fontSize: '1rem',
                color: screen.isLarge ? 'inherit' : theme.palette.text.secondary,
            }}
            title={`Last updated: ${moment(item.updated_at).format('lll')}`}
        >
            {moment(item.created_at).format('lll')}
        </span>
    );
};
