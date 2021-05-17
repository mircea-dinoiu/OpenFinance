import {amber, blueGrey, lightGreen, red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import {PaletteOptions} from '@material-ui/core/styles/createPalette';
import '@material-ui/lab/themeAugmentation';

export const createTheme = () => {
    const palette: PaletteOptions = {
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
    };

    const theme = createMuiTheme({
        shape: {
            borderRadius: 0,
        },
        palette,
        props: {
            MuiTextField: {
                variant: 'outlined',
                size: 'small',
            },
            MuiSelect: {
                variant: 'outlined',
                margin: 'dense',
            },
            MuiButton: {
                variant: 'contained',
                size: 'small',
            },
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    'html, body, #root': {
                        minHeight: '100%',
                        fontSize: '14px',
                    },
                    body: {
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 300,
                        background: palette.background?.default,
                        '-webkit-font-smoothing': 'antialiased',
                        overflowY: 'scroll',
                    },
                    '*': {
                        outline: 'none !important',
                    },
                    '.MuiDataGrid-main > :first-child': {
                        display: 'none',
                    },
                },
            },
            MuiSlider: {
                valueLabel: {
                    zIndex: 'auto',
                },
            },
            MuiChip: {
                root: {
                    borderRadius: 0,
                },
            },
        },
    });

    if (process.env.NODE_ENV !== 'production') {
        // @ts-ignore
        window.theme = theme;
    }

    return theme;
};
