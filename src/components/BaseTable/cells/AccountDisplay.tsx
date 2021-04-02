import IconBlock from '@material-ui/icons/Block';
import IconLock from '@material-ui/icons/Lock';
import {Account, AccountStatus} from 'domain/accounts/defs';
import * as React from 'react';

export const AccountDisplay = (moneyLocation: Account) => {
    const IconComponent = StatusToIconComponent[moneyLocation.status];

    return (
        <span title={moneyLocation.name}>
            <IconComponent
                style={{
                    fontSize: '1rem',
                    position: 'relative',
                    top: 2,
                    left: -1,
                }}
            />
            {moneyLocation.name}
        </span>
    );
};

const StatusToIconComponent: Record<AccountStatus, any> = {
    closed: IconBlock,
    locked: IconLock,
    open: 'i',
};
