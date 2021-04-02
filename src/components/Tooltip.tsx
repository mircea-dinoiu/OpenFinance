import {Tooltip as MaterialUITooltip} from '@material-ui/core';
import * as React from 'react';
import {ReactNode} from 'react';
import styled from 'styled-components';

export const Tooltip = ({
    children,
    className,
    tooltip: title,
}: {
    children: React.ReactNode;
    className?: string;
    tooltip: ReactNode;
}) => (
    <MaterialUITooltip title={<Title style={{}}>{title}</Title>} disableFocusListener={true} placement="bottom">
        <span className={className}>{children}</span>
    </MaterialUITooltip>
);

const Title = styled('div')(({theme}) => ({
    fontSize: '1rem',
    lineHeight: 1,
    padding: theme.spacing(1),
}));
