import {AccountDisplay} from 'components/BaseTable/cells/AccountDisplay';
import * as React from 'react';
import {useAccounts} from 'accounts/state';

export const AccountDisplayById = ({id}: {id: number | string}) => {
    const moneyLocations = useAccounts();

    if (!id) {
        return null;
    }

    const moneyLocation = moneyLocations.find((each) => each.id === Number(id));

    if (!moneyLocation) {
        return null;
    }

    return <AccountDisplay {...moneyLocation} />;
};
