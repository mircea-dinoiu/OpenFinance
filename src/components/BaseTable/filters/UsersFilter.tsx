import * as React from 'react';
import {useSelectedProject} from 'state/projects';
import {SelectFilter} from './SelectFilter';

export const UsersFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
        items={useSelectedProject().users}
    />
);
