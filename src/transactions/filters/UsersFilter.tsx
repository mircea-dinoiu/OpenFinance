import * as React from 'react';
import {useSelectedProject} from 'projects/state';
import {SelectFilter, SelectFilterProps} from 'transactions/filters/SelectFilter';

export const UsersFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
        items={useSelectedProject().users}
    />
);
