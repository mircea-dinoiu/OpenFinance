import * as React from 'react';
import SelectFilter from './SelectFilter';
import {useUsers} from 'state/hooks';

const UsersFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
        items={useUsers().list}
    />
);

export default UsersFilter;
