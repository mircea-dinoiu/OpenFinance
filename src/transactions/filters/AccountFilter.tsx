import {sortMoneyLocations} from 'transactions/helpers';
import * as React from 'react';
import {useAccounts} from 'accounts/state';
import {SelectFilter, SelectFilterProps} from 'transactions/filters/SelectFilter';

export const AccountFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter onChange={onChange} filter={filter} allowNone={false} items={sortMoneyLocations(useAccounts())} />
);
