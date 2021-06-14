import {useMediaQuery, Theme} from '@material-ui/core';

export const useIsDesktop = () =>
    useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {
        noSsr: true,
    });
