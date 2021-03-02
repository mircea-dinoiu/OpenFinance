import {blueGrey, lightGreen, red, amber} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import {Column} from 'react-table-6';

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

export const colors = {
    hover: blueGrey[700],
    pastRow: blueGrey[900],
    tableHighlight: blueGrey[600],
    borderSecondary: blueGrey[700],
    borderPrimary: blueGrey[600],
    tableFoot: blueGrey[700],
    tableHeaderBorder: blueGrey[700],
    tableHeaderBg: blueGrey[800],
    personAvatarBg: blueGrey[700],
    tooltipBg: blueGrey[800],
};

export const theme = createMuiTheme({
    palette: {
        primary: blueGrey,
        secondary: {
            main: blueGrey['50'],
        },
        background: {
            paper: blueGrey[800],
            default: blueGrey[900],
        },
        success: {
            main: lightGreen[900],
        },
        error: {
            main: red[900],
        },
        warning: amber,
        contrastThreshold: 0,
        type: 'dark',
    },
});

export const numericColumnStyles: Column<any> = {
    headerStyle: {
        textAlign: 'right',
    },
    style: {
        textAlign: 'right',
    },
};
export const firstColumnStyles: Column<any> = {
    headerStyle: {
        textAlign: 'left',
    },
};
