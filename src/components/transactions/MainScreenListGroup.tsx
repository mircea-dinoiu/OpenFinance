import * as React from 'react';
import moment from 'moment';
import {CalendarWithoutTime} from 'defs/formats';
import {List, ListSubheader} from '@material-ui/core';
import {MainScreenListItem} from 'components/transactions/MainScreenListItem';

export const MainScreenListGroup = ({date, items, itemProps}) => (
    <div>
        <List>
            <ListSubheader style={{textAlign: 'center'}}>
                {moment(date).calendar(null, CalendarWithoutTime)}
            </ListSubheader>
            {items.map((item) => (
                <MainScreenListItem key={item.id} item={item} {...itemProps} />
            ))}
        </List>
    </div>
);
