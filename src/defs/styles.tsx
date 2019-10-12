// @flow
import * as React from 'react';

export const flexColumn: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
};

export const greyedOut = {
    filter: 'grayscale(100%)',
    opacity: 0.5,
};

export const overflowVisible = {
    overflow: 'visible',
};

export const dialog = {
    root: {
        padding: 10,
    },
    paper: {
        margin: '0 auto !important',
        maxHeight: '100%',
    },
};

export const spacingSmall = '5px';
export const spacingMedium = '10px';
export const spacingLarge = '20px';
