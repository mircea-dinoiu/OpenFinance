import React from 'react';
import {Snackbar} from 'material-ui';
import {red500, green500} from 'material-ui/styles/colors';
import transitions from 'material-ui/styles/transitions';

const style = {
    bottom: 'auto',
    top: '50%',
    width: '75%',
    transform: 'translate(-50%, 0)',
    transition: transitions.easeOut('0ms', 'visibility')
};

const bodyStyle = {
    borderRadius: '2px',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
};

const defaultProps = {
    autoHideDuration: 1500,
    open: true,
    style,
};

export const ErrorSnackbar = (props) => (
    <Snackbar {...defaultProps} bodyStyle={{backgroundColor: red500, ...bodyStyle, ...props.bodyStyle}} {...props}/>
);

export const SuccessSnackbar = (props) => (
    <Snackbar {...defaultProps} bodyStyle={{backgroundColor: green500, ...bodyStyle, ...props.bodyStyle}} {...props}/>
);