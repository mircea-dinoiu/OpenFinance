// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {sortMoneyLocations} from 'mobile/ui/internal/common/helpers';
import {useMoneyLocations} from 'common/state';

const AccountFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useMoneyLocations())}
    />
);

export default AccountFilter;
