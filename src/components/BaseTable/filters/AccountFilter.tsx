import * as React from 'react';
import SelectFilterWrapped from './SelectFilter';
import {sortMoneyLocations} from 'components/internal/common/helpers';
import {useMoneyLocations} from 'state/hooks';

export const AccountFilter = ({onChange, filter}) => (
    <SelectFilterWrapped
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useMoneyLocations())}
    />
);
