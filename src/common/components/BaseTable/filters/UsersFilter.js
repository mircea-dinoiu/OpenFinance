// @flow weak
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {useUser} from 'common/state/hooks';

const UsersFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
        items={useUser().list}
    />
);

export default UsersFilter;
