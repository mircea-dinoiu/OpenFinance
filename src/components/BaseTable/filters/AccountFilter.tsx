import {sortMoneyLocations} from 'components/transactions/helpers';
import * as React from 'react';
import {useAccounts} from 'state/accounts';
import {SelectFilter, SelectFilterProps} from './SelectFilter';

export const AccountFilter = ({
    onChange,
    filter,
}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useAccounts())}
    />
);
