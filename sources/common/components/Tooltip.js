// @flow weak
import * as React from 'react';
import {Tooltip as MaterialUITooltip} from '@material-ui/core';
import type {TypeCss} from 'common/types';

const Tooltip = ({
    children,
    className,
    tooltip: title,
}: {
    children: React.Node,
    className?: string,
    tooltip: React.Node,
    css?: TypeCss,
}) => (
    <MaterialUITooltip
        title={<div style={{fontSize: '1.5em'}}>{title}</div>}
        disableFocusListener={true}
        placement="bottom"
    >
        <span className={className}>{children}</span>
    </MaterialUITooltip>
);

export default Tooltip;
