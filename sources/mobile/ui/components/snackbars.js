import React from 'react';
import {Snackbar} from 'material-ui';
import {red500, green500} from 'material-ui/styles/colors';

export const ErrorSnackbar = (props) => (
    <Snackbar open={true} bodyStyle={{backgroundColor: red500, ...props.bodyStyle}} {...props}/>
);

export const SuccessSnackbar = (props) => (
    <Snackbar open={true} bodyStyle={{backgroundColor: green500, ...props.bodyStyle}} {...props}/>
);