import {useCategories} from 'domain/categories/state';
import * as React from 'react';
import {SelectFilter, SelectFilterProps} from './SelectFilter';

export const CategoriesFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter onChange={onChange} filter={filter} multi={true} items={useCategories()} />
);
