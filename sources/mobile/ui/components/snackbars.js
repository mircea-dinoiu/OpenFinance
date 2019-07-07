// @flow
import {hideSnackbar, showSnackbar} from 'common/state/actions';
import type {TypeSnackbarOwnProps} from 'common/types';
import {uniqueId} from 'lodash';
import * as React from 'react';
import {Snackbar} from 'material-ui';
import {red, green} from '@material-ui/core/colors';
import {connect} from 'react-redux';

export const CustomSnackbar = connect(({screen}) => ({screen}))((props) => (
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
));

const withSnackbarActionCreators = connect(
    null,
    {showSnackbar, hideSnackbar},
);

type TypeSnackbarProps = {|
    ...TypeSnackbarOwnProps,
    showSnackbar: typeof showSnackbar,
    hideSnackbar: typeof hideSnackbar,
|};

export const ErrorSnackbar = withSnackbarActionCreators(
    class extends React.PureComponent<TypeSnackbarProps> {
        id = uniqueId();

        componentDidMount(): void {
            this.props.showSnackbar({
                id: this.id,
                message: this.props.message,
                bodyStyle: {
                    ...this.props.bodyStyle,
                    backgroundColor: red[500],
                },
            });
        }

        componentWillUnmount(): void {
            this.props.hideSnackbar(this.id);
        }

        render() {
            return null;
        }
    },
);

export const SuccessSnackbar = withSnackbarActionCreators(
    class extends React.PureComponent<TypeSnackbarProps> {
        id = uniqueId();

        componentDidMount(): void {
            this.props.showSnackbar({
                id: this.id,
                message: this.props.message,
                bodyStyle: {
                    ...this.props.bodyStyle,
                    backgroundColor: green[500],
                },
            });

            setTimeout(() => {
                this.props.hideSnackbar(this.id);
            }, 1500);
        }

        render() {
            return null;
        }
    },
);
