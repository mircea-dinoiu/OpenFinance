import {amber, blueGrey, lightGreen, red} from '@material-ui/core/colors';
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

export const stickyHeaderHeight = '48px';

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
