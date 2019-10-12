import * as React from 'react';
import SelectFilter from './SelectFilter';
import {sortMoneyLocations} from 'components/internal/common/helpers';
import {useMoneyLocations} from 'state/hooks';

const AccountFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useMoneyLocations())}
    />
);

export default AccountFilter;
