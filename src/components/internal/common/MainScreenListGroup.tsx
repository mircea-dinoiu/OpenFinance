import * as React from 'react';
import moment from 'moment';
import {CalendarWithoutTime} from 'defs/formats';
import {Divider, List, Subheader} from 'material-ui';
import {MainScreenListItem} from 'components/internal/common/MainScreenListItem';

export const MainScreenListGroup = ({date, items, itemProps}) => (
    <div>
        <List>
            <Subheader style={{textAlign: 'center'}}>
                {moment(date).calendar(null, CalendarWithoutTime)}
            </Subheader>
            {items.map((item) => (
                <MainScreenListItem key={item.id} item={item} {...itemProps} />
            ))}
        </List>
        <Divider />
    </div>
);
