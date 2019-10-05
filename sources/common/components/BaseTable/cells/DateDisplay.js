// @flow
import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import moment from 'moment';
import Tooltip from 'common/components/Tooltip';
import {useScreenSize} from 'common/state/hooks';

const DateDisplay = ({item}) => {
    const screen = useScreenSize();

    return (
        <span
            style={{
                fontSize: '1rem',
                color: screen.isLarge ? 'inherit' : grey[500],
            }}
        >
            <Tooltip
                tooltip={`Last updated: ${moment(item.updated_at).format(
                    'lll',
                )}`}
            >
                {moment(item.created_at).format('lll')}
            </Tooltip>
        </span>
    );
};

export default DateDisplay;
