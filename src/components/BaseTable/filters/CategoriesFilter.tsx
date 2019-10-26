import * as React from 'react';
import {SelectFilter} from './SelectFilter';
import {useCategories} from 'state/hooks';

export const CategoriesFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        items={useCategories()}
    />
);
