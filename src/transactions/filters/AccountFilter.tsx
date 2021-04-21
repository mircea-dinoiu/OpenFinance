import {Accounts, AccountStatus} from 'accounts/defs';
import {useAccounts} from 'accounts/state';
import {sortBy} from 'lodash';
import * as React from 'react';
import {SelectFilter, SelectFilterProps} from 'transactions/filters/SelectFilter';

export const sortMoneyLocations = (items: Accounts) =>
    sortBy(items, (item) => `${Object.values(AccountStatus).indexOf(item.status)}#${item.name}`);
export const AccountFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter onChange={onChange} filter={filter} allowNone={false} items={sortMoneyLocations(useAccounts())} />
);
