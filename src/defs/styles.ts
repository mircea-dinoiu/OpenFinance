import * as React from 'react';
import {createMuiTheme} from '@material-ui/core/styles';
import {blue, grey} from '@material-ui/core/colors';

export const flexColumn: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
};

export const greyedOut = {
    filter: 'grayscale(100%)',
    opacity: 0.5,
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

export const gridGap = spacingMedium;

export const screenQuerySmall = '(min-width: 0px) and (max-width: 480px)';
export const screenQueryMedium = '(min-width: 481px) and (max-width: 1024px)';
export const screenQueryLarge = '(min-width: 1025px)';

export const theme = createMuiTheme({
    palette: {
        primary: blue,
        // type: 'dark',
        background: {
            default: grey[300]
        }
    },
    typography: {
        htmlFontSize: 16,
    },
});
