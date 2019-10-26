import * as React from 'react';
import SelectFilterWrapped from './SelectFilter';
import {useUsers} from 'state/hooks';

export const UserFilter = ({onChange, filter}) => (
    <SelectFilterWrapped
        onChange={onChange}
        filter={filter}
        allowNone={false}
        nameKey="full_name"
        items={useUsers().list}
    />
);
