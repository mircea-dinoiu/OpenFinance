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

export const screenQuerySmall = '(min-width: 0px) and (max-width: 480px)';
export const screenQueryMedium = '(min-width: 481px) and (max-width: 1024px)';
export const screenQueryLarge = '(min-width: 1025px)';
