// @flow
import React, { PureComponent } from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Row, Col } from 'react-grid-system';

import { ErrorSnackbar, SuccessSnackbar } from '../../components/snackbars';
import { ButtonProgress } from '../../components/loaders';

import { parseCRUDError } from 'common/parsers';
import { dialog } from 'common/defs/styles';

type TypeProps = {
    onRequestUpdate: Function,
};

class MainScreenEditDialog extends PureComponent<TypeProps> {
    state = {
        saving: false,
    };
    formData = this.props.modelToForm(this.props.item);

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true,
        });

        try {
            const response = await this.props.onRequestUpdate([
                this.props.formToModel(data, this.props),
            ]);
            const json = response.data;

            this.setState({
                success: `The ${
                    this.props.entityName
                } was successfully updated`,
                saving: false,
            });

            setTimeout(() => {
                this.setState({
                    error: null,
                    success: null,
                });
                this.props.onSave(json[0]);
            }, 500);
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
                <DialogTitle>{`Edit ${this.props.entityName}`}</DialogTitle>
                <DialogContent style={{ overflow: 'visible' }}>
                    <Row>
                        <Form
                            onFormChange={(formData) =>
                                (this.formData = formData)
                            }
                            initialValues={this.formData}
                        />
                    </Row>
                    <Col>
                        {this.state.error && (
                            <ErrorSnackbar
                                key={Math.random()}
                                message={this.state.error}
                            />
                        )}
                        {this.state.success && (
                            <SuccessSnackbar
                                key={Math.random()}
                                message={this.state.success}
                            />
                        )}
                    </Col>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        onClick={this.props.onCancel}
                        onTouchTap={this.props.onCancel}
                        style={{ marginRight: 5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        color="primary"
                        onClick={this.save}
                        onTouchTap={this.save}
                        style={{ float: 'right' }}
                    >
                        {this.state.saving ? <ButtonProgress /> : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(dialog)(MainScreenEditDialog);
