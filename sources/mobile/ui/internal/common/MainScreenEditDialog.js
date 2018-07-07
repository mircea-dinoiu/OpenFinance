// @flow
import React, { PureComponent } from 'react';

import { Dialog, RaisedButton } from 'material-ui';

import { Row, Col } from 'react-grid-system';

import { ErrorSnackbar, SuccessSnackbar } from '../../components/snackbars';
import { ButtonProgress } from '../../components/loaders';

import { fetchJSON } from 'common/utils/fetch';
import { parseCRUDError } from 'common/parsers';

export default class MainScreenEditDialog extends PureComponent {
    state = {
        saving: false,
    };
    formData = this.props.modelToForm(this.props.entity);

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true,
        });

        const response = await fetchJSON(this.props.api.update, {
            method: 'POST',
            body: { data: [this.props.formToModel(data, this.props)] },
        });
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
                <RaisedButton
                    disabled={this.state.saving}
                    label="Cancel"
                    primary={false}
                    onTouchTap={this.props.onCancel}
                    style={{ marginRight: 5 }}
                />
                <RaisedButton
                    disabled={this.state.saving}
                    label={this.state.saving ? <ButtonProgress /> : 'Update'}
                    primary={true}
                    onTouchTap={this.save}
                    style={{ float: 'right' }}
                />
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
                        {...this.props.data}
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
