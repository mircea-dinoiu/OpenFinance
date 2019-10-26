import * as React from 'react';
import SelectFilterWrapped from './SelectFilter';
import {useUsers} from 'state/hooks';

export const UsersFilter = ({onChange, filter}) => (
    <SelectFilterWrapped
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
        items={useUsers().list}
    />
);
