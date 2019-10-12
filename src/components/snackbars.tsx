import {hideSnackbar, showSnackbar} from 'state/actionCreators';
import {uniqueId} from 'lodash';
import * as React from 'react';
import {Snackbar} from 'material-ui';
import {green, red} from '@material-ui/core/colors';
import {useDispatch} from 'react-redux';
import {TypeSnackbarProps} from 'types';

export const CustomSnackbar = (props) => (
    <Snackbar
        open={props.open}
        message={props.message}
        bodyStyle={{
            height: 'auto',
            lineHeight: 1.2,
            padding: '10px 20px',
            boxShadow:
                'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            ...props.bodyStyle,
        }}
    />
);

export const ErrorSnackbar = (props: TypeSnackbarProps) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const id = uniqueId();

        dispatch(
            showSnackbar({
                id,
                message: props.message,
                bodyStyle: {
                    ...props.bodyStyle,
                    backgroundColor: red[500],
                },
            }),
        );

        return () => {
            dispatch(hideSnackbar(id));
        };
    }, []);

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
                bodyStyle: {
                    ...props.bodyStyle,
                    backgroundColor: green[500],
                },
            }),
        );

        setTimeout(() => {
            dispatch(hideSnackbar(id));
        }, 1500);
    }, []);

    return null;
};
