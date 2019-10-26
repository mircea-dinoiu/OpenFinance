import * as React from 'react';
import {SelectFilter} from './SelectFilter';
import {useUsers} from 'state/hooks';

export const UserFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        nameKey="full_name"
        items={useUsers().list}
    />
);
