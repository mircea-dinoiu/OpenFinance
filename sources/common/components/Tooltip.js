// @flow
import React from 'react';
import { Tooltip as Tippy } from 'react-tippy';

const Tooltip = ({
    children,
    tooltip,
}: {
    children: React$Element<any>,
    tooltip: React$Element<any>,
}) => (
    <Tippy
        html={
            <div style={{ fontSize: '14px', textAlign: 'left' }}>{tooltip}</div>
        }
        delay={500}
        position="bottom"
        trigger="mouseenter"
    >
        {children}
    </Tippy>
);

export default Tooltip;
