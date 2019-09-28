// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {useCategories} from 'common/state';

const CategoriesFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        items={useCategories()}
    />
);

export default CategoriesFilter;
