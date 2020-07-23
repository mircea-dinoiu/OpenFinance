import * as React from 'react';
import grey from '@material-ui/core/colors/grey';
import IconBlock from '@material-ui/icons/Block';
import IconLock from '@material-ui/icons/Lock';
import {useMoneyLocations} from 'state/hooks';

const StatusToIconComponent = {
    closed: IconBlock,
    locked: IconLock,
    open: 'i',
};

export const MoneyLocationDisplay = ({id}: {id: number | string}) => {
    const moneyLocations = useMoneyLocations();

    if (!id) {
        return null;
    }

    const moneyLocation = moneyLocations.find((each) => each.id === Number(id));

    if (!moneyLocation) {
        return null;
    }
    const IconComponent = StatusToIconComponent[moneyLocation.status];

    return id ? (
        <span
            style={{fontSize: '1rem', color: grey[700]}}
            title={moneyLocation.name}
        >
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
    ) : null;
};
