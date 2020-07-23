import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import moment from 'moment';
import {useScreenSize} from 'state/hooks';
import {TransactionModel} from 'types';

export const DateDisplay = ({item}: {item: TransactionModel}) => {
    const screen = useScreenSize();

    return (
        <span
            style={{
                fontSize: '1rem',
                color: screen.isLarge ? 'inherit' : grey[500],
            }}
            title={`Last updated: ${moment(item.updated_at).format('lll')}`}
        >
            {moment(item.created_at).format('lll')}
        </span>
    );
};
