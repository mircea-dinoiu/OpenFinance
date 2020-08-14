import {blue, grey} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

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
export const spacingNormal = '10px';
export const spacingLarge = '20px';

export const stickyHeaderHeight = '48px';

export const gridGap = spacingNormal;

export const screenQuerySmall = '(min-width: 0px) and (max-width: 480px)';
export const screenQueryMedium = '(min-width: 481px) and (max-width: 1024px)';
export const screenQueryLarge = '(min-width: 1025px)';
export enum ScreenQuery {
    SMALL = '@media (min-width: 0px) and (max-width: 480px)',
    MEDIUM = '@media (min-width: 481px) and (max-width: 1024px)',
    LARGE = '@media (min-width: 1025px)',
}

export const theme = createMuiTheme({
    palette: {
        primary: blue,
        // type: 'dark',
        background: {
            default: grey[300],
        },
    },
});
