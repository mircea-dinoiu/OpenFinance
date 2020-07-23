import * as React from 'react';
import {SelectFilter, SelectFilterProps} from './SelectFilter';
import {useCategories} from 'state/hooks';

export const CategoriesFilter = ({
    onChange,
    filter,
}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        items={useCategories()}
    />
);
