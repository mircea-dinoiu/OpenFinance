// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {useUser} from 'common/state';

const UserFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        nameKey="full_name"
        items={useUser().list}
    />
);

export default UserFilter;
