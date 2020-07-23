import * as React from 'react';
import moment from 'moment';
import {CalendarWithoutTime} from 'defs/formats';
import {List, ListSubheader} from '@material-ui/core';
import {
    MainScreenListItem,
    MainScreenListItemProps,
} from 'components/transactions/MainScreenListItem';
import {TransactionModel} from 'types';

export const MainScreenListGroup = ({
    date,
    items,
    itemProps,
}: {
    date: string;
    items: TransactionModel[];
    itemProps: Omit<MainScreenListItemProps<TransactionModel>, 'item'>;
}) => (
    <div>
        <List>
            <ListSubheader style={{textAlign: 'center'}}>
                {moment(date).calendar(undefined, CalendarWithoutTime)}
            </ListSubheader>
            {items.map((item) => (
                <MainScreenListItem key={item.id} item={item} {...itemProps} />
            ))}
        </List>
    </div>
);
