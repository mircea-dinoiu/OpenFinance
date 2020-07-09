import {Snackbar} from '@material-ui/core';
import {Alert, AlertProps} from '@material-ui/lab';
import {Color} from '@material-ui/lab/Alert/Alert';
import {uniqueId} from 'lodash';
import * as React from 'react';
import {ReactNode, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {hideSnackbar, showSnackbar} from 'state/actionCreators';
import {SnackbarProps} from 'types';

export const FloatingSnackbar = ({
    open = true,
    severity,
    message,
}: {
    message: ReactNode;
    open?: boolean;
    severity: Color;
}) => {
    return (
        <Snackbar open={open}>
            <Alert severity={severity}>{message}</Alert>
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

export const useTemporarySnackbar = (severity: AlertProps['severity']) => {
    const dispatch = useDispatch();

    const callback = useCallback(
        (message: ReactNode) => {
            const id = uniqueId();

            dispatch(
                showSnackbar({
                    id,
                    message,
                    severity,
                }),
            );

            setTimeout(() => {
                dispatch(hideSnackbar(id));
            }, 3000);
        },
        [dispatch, severity],
    );

    return callback;
};

export const SuccessSnackbar = (props: SnackbarProps) => {
    const showSuccessSnackbar = useTemporarySnackbar('success');

    useEffect(() => {
        showSuccessSnackbar(props.message);
    }, [props.message]);

    return null;
};
