// @flow
import * as React from 'react';
import {Tooltip as MaterialUITooltip} from '@material-ui/core';

const Tooltip = ({
    children,
    tooltip: title,
}: {
    children: React$Element<any>,
    tooltip: React$Element<any>,
}) => (
    <MaterialUITooltip
        title={<div style={{fontSize: '1.5em'}}>{title}</div>}
        disableFocusListener={true}
        placement="bottom"
    >
        <span>{children}</span>
    </MaterialUITooltip>
);

export default Tooltip;
