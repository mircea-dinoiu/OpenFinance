import {amber, blueGrey, lightGreen, red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import {PaletteOptions} from '@material-ui/core/styles/createPalette';
import {colors} from './colors';

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
            },
            MuiFab: {
                color: 'primary',
            },
            // @ts-ignore
            MuiDataGrid: {
                density: 'compact',
            },
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    'html, body, #root': {
                        minHeight: '100%',
                        fontSize: '16px',
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

                    '.positionRelative': {
                        position: 'relative',
                    },
                    // Data Grid
                    '.MuiDataGrid-main > :first-child': {
                        display: 'none',
                    },
                    '.MuiDataGridFilterForm-root': {
                        gridGap: '8px',
                        alignItems: 'flex-end',
                    },
                    '.MuiDataGrid-footer': {
                        background: colors.tableFoot,
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
            // @ts-ignore
            MuiDataGrid: {
                root: {
                    borderColor: colors.borderSecondary,
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
