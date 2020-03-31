import {hideSnackbar, showSnackbar} from 'state/actionCreators';
import {uniqueId} from 'lodash';
import * as React from 'react';
import {Snackbar} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {SnackbarProps, Snackbar as TypeSnackbar} from 'types';
import {Alert} from '@material-ui/lab';
import {useEffect} from 'react';

export const CustomSnackbar = (props: TypeSnackbar & {open: boolean}) => {
    return (
        <Snackbar open={props.open}>
            <Alert severity={props.severity}>{props.message}</Alert>
        </Snackbar>
    );
};

export const ErrorSnackbar = (props: SnackbarProps) => {
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

export const useSuccessSnackbar = () => {
    const dispatch = useDispatch();

    return ({message}: Pick<SnackbarProps, 'message'>) => {
        const id = uniqueId();

        dispatch(
            showSnackbar({
                id,
                message,
                severity: 'success',
            }),
        );

        setTimeout(() => {
            dispatch(hideSnackbar(id));
        }, 1500);
    };
};

export const SuccessSnackbar = (props: SnackbarProps) => {
    const showSuccessSnackbar = useSuccessSnackbar();

    useEffect(() => {
        showSuccessSnackbar(props);
    }, [props.message]);

    return null;
};
