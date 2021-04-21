import {List, ListSubheader} from '@material-ui/core';
import {MainScreenListItem, MainScreenListItemProps} from 'transactions/MainScreenListItem';
import {TransactionModel} from 'transactions/defs';
import {CalendarWithoutTime} from 'app/dates/defs';
import moment from 'moment';
import * as React from 'react';

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
