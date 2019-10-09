// @flow weak
import * as React from 'react';
import grey from '@material-ui/core/colors/grey';
import IconBlock from '@material-ui/icons/Block';
import IconLock from '@material-ui/icons/Lock';

import Tooltip from 'common/components/Tooltip';
import {useMoneyLocations} from 'common/state/hooks';

const StatusToIconComponent = {
    closed: IconBlock,
    locked: IconLock,
    open: 'i',
};

const MoneyLocationDisplay = ({id}) => {
    if (!id) {
        return null;
    }

    const moneyLocations = useMoneyLocations();
    const moneyLocation = moneyLocations.find((each) => each.id === Number(id));
    const IconComponent = StatusToIconComponent[moneyLocation.status];

    return (
        id && (
            <span style={{fontSize: '1rem', color: grey[700]}}>
                <IconComponent
                    style={{
                        fontSize: '1rem',
                        position: 'relative',
                        top: 2,
                        left: -1,
                    }}
                />
                <Tooltip tooltip={moneyLocation.name}>
                    {moneyLocation.name}
                </Tooltip>
            </span>
        )
    );
};

export default MoneyLocationDisplay;
