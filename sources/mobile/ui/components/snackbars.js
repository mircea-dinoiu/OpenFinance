// @flow
import React from 'react';
import { Snackbar } from 'material-ui';
import { red, green } from '@material-ui/core/colors';
import transitions from 'material-ui/styles/transitions';
import { connect } from 'react-redux';
import omit from 'lodash/omit';

const style = {
    bottom: 'auto',
    top: '50%',
    width: '75%',
    transform: 'translate(-50%, 0)',
    transition: transitions.easeOut('0ms', 'visibility'),
};
const getBodyStyle = ({ screen }) =>
    screen.isLarge
        ? {}
        : {
            borderRadius: '2px',
            boxShadow:
                  'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        };
const getDefaultProps = ({ screen }) => ({
    autoHideDuration: 1500,
    open: true,
    style: screen.isLarge ? undefined : style,
});
const CustomSnackbar = connect(({ screen }) => ({ screen }))((props) => (
    <Snackbar
        {...getDefaultProps({ screen: props.screen })}
        {...omit(props, 'dispatch')}
        bodyStyle={{
            ...getBodyStyle({ screen: props.screen }),
            ...props.bodyStyle,
        }}
    />
));

export const ErrorSnackbar = (props) => (
    <CustomSnackbar
        {...props}
        bodyStyle={{ ...props.bodyStyle, backgroundColor: red[500] }}
    />
);

export const SuccessSnackbar = (props) => (
    <CustomSnackbar
        {...props}
        bodyStyle={{ ...props.bodyStyle, backgroundColor: green[500] }}
    />
);
