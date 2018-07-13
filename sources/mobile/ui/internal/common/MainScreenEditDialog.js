// @flow
import React, { PureComponent } from 'react';

import { Dialog } from 'material-ui';
import { Button } from '@material-ui/core';

import { Row, Col } from 'react-grid-system';

import { ErrorSnackbar, SuccessSnackbar } from '../../components/snackbars';
import { ButtonProgress } from '../../components/loaders';

import { parseCRUDError } from 'common/parsers';

type TypeProps = {
    onRequestUpdate: Function,
};

export default class MainScreenEditDialog extends PureComponent<TypeProps> {
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

        const response = await this.props.onRequestUpdate([
            this.props.formToModel(data, this.props),
        ]);
        const json = await response.json();

        if (response.ok) {
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
        } else {
            this.setState({
                error: parseCRUDError(json),
                saving: false,
            });
        }
    };

    render() {
        const actions = (
            <React.Fragment>
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
            </React.Fragment>
        );
        const Form = this.props.formComponent;

        return (
            <Dialog
                title={`Edit ${this.props.entityName}`}
                open={this.props.open}
                autoScrollBodyContent={true}
                actions={actions}
                contentStyle={{ width: '95%' }}
            >
                <Row>
                    <Form
                        onFormChange={(formData) => (this.formData = formData)}
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
            </Dialog>
        );
    }
}
