import * as React from 'react';
import {Tooltip as MaterialUITooltip} from '@material-ui/core';

const Tooltip = ({
    children,
    className,
    tooltip: title,
}: {
    children: React.ReactNode;
    className?: string;
    tooltip: React.ReactNode;
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
