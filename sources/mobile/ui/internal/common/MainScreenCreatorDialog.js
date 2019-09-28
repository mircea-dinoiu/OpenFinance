// @flow
import React, {PureComponent} from 'react';
import {parseCRUDError} from 'common/parsers';

import {ErrorSnackbar, SuccessSnackbar} from '../../components/snackbars';
import {ButtonProgress} from '../../components/loaders';

import {Col, Row} from 'react-grid-system';

import {connect} from 'react-redux';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {dialog} from 'common/defs/styles';

type TypeProps = {
    getFormDefaults: Function,
    formToModel: Function,
    entityName: string,
    onReceiveNewRecord: Function,
    formComponent: any,
    onRequestCreate: Function,
};

class MainScreenCreatorDialog extends PureComponent<TypeProps> {
    state = {
        saving: false,
    };
    formDefaults = this.props.getFormDefaults(this.props);
    formData = this.props.getFormDefaults(this.props);

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true,
        });

        try {
            const response = await this.props.onRequestCreate([
                this.props.formToModel(data, this.props),
            ]);
            const json = response.data;

            this.setState({
                success: `The ${this.props.entityName} was successfully created`,
                saving: false,
            });

            this.props.onReceiveNewRecord(json[0]);
        } catch (e) {
            if (e.response) {
                this.setState({
                    error: parseCRUDError(e.response.data),
                    saving: false,
                });
            } else {
                this.setState({
                    error: e.message,
                    saving: false,
                });
            }
        }
    };

    render() {
        const Form = this.props.formComponent;

        return (
            <Dialog
                open={this.props.open}
                classes={this.props.classes}
                fullWidth={true}
            >
                <DialogTitle>{`Create ${this.props.entityName}`}</DialogTitle>
                <DialogContent style={{overflow: 'visible'}}>
                    <Row>
                        <Form
                            onFormChange={(formData) =>
                                (this.formData = formData)
                            }
                            initialValues={this.formDefaults}
                        />
                    </Row>
                    <Col>
                        {this.state.error && (
                            <ErrorSnackbar message={this.state.error} />
                        )}
                        {this.state.success && (
                            <SuccessSnackbar message={this.state.success} />
                        )}
                    </Col>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        onClick={this.props.onCancel}
                        onTouchTap={this.props.onCancel}
                        style={{marginRight: 5}}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        color="primary"
                        onClick={this.save}
                        onTouchTap={this.save}
                        style={{float: 'right'}}
                    >
                        {this.state.saving ? <ButtonProgress /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(({currencies, user}) => ({currencies, user}))(
    withStyles(dialog)(MainScreenCreatorDialog),
);
