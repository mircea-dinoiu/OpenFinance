import {AlertProps} from '@material-ui/lab';
import * as React from 'react';

export type SnackbarProps = {
    message: React.ReactNode;
};
export type Snackbar = {
    id: string;
    severity: AlertProps['severity'];
} & SnackbarProps;
