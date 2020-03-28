import {hideSnackbar, showSnackbar} from 'state/actionCreators';
import {uniqueId} from 'lodash';
import * as React from 'react';
import {Snackbar} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {TypeSnackbarProps, TypeSnackbar} from 'types';
import {Alert} from '@material-ui/lab';

export const CustomSnackbar = (props: TypeSnackbar & {open: boolean}) => {
    return (
        <Snackbar
            open={props.open}
        >
            <Alert severity={props.severity}>{props.message}</Alert>
        </Snackbar>
    );
};

export const ErrorSnackbar = (props: TypeSnackbarProps) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const id = uniqueId();

        dispatch(
            showSnackbar({
                id,
                message: props.message,
                severity: 'error',
            }),
        );

        return () => {
            dispatch(hideSnackbar(id));
        };
    }, [dispatch, props.message]);

    return null;
};

export const SuccessSnackbar = (props: TypeSnackbarProps) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const id = uniqueId();

        dispatch(
            showSnackbar({
                id,
                message: props.message,
                severity: 'success',
            }),
        );

        setTimeout(() => {
            dispatch(hideSnackbar(id));
        }, 1500);
    }, [dispatch, props.message]);

    return null;
};
