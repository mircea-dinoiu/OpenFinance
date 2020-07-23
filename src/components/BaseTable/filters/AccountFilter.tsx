import {sortMoneyLocations} from 'components/transactions/helpers';
import * as React from 'react';
import {useMoneyLocations} from 'state/hooks';
import {SelectFilter, SelectFilterProps} from './SelectFilter';

export const AccountFilter = ({
    onChange,
    filter,
}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useMoneyLocations())}
    />
);
