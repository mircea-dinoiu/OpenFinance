// @flow
import * as React from 'react';
import grey from '@material-ui/core/colors/grey';
import IconBlock from '@material-ui/icons/Block';
import IconLock from '@material-ui/icons/Lock';

import {connect} from 'react-redux';
import Tooltip from 'common/components/Tooltip';

const StatusToIconComponent = {
    closed: IconBlock,
    locked: IconLock,
    open: 'i',
};

const MoneyLocationDisplay = ({id, moneyLocations}) => {
    if (!id) {
        return null;
    }

    const moneyLocation = moneyLocations
        .find((each) => each.get('id') === Number(id))
        .toJS();
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
const mapStateToProps = ({moneyLocations}) => ({moneyLocations});

export default connect(mapStateToProps)(MoneyLocationDisplay);
