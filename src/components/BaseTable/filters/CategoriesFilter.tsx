import * as React from 'react';
import SelectFilterWrapped from './SelectFilter';
import {useCategories} from 'state/hooks';

export const CategoriesFilter = ({onChange, filter}) => (
    <SelectFilterWrapped
        onChange={onChange}
        filter={filter}
        multi={true}
        items={useCategories()}
    />
);
