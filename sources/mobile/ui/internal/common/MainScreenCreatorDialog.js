// @flow
import React, { PureComponent } from 'react';
import { parseCRUDError } from 'common/parsers';

import { ErrorSnackbar, SuccessSnackbar } from '../../components/snackbars';
import { ButtonProgress } from '../../components/loaders';

import { Col, Row } from 'react-grid-system';

import { Dialog } from 'material-ui';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

class MainScreenCreatorDialog extends PureComponent {
    state = {
        createCount: 1,
        saving: false,
    };
    props: {
        getFormDefaults: Function,
        formToModel: Function,
        entityName: string,
        onReceiveNewRecord: Function,
        formComponent: any,
        onRequestCreate: Function,
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

        const response = await this.props.onRequestCreate([
            this.props.formToModel(data, this.props),
        ]);
        const json = await response.json();

        if (response.ok) {
            this.setState({
                success: `The ${
                    this.props.entityName
                } was successfully created`,
                createCount: this.state.createCount + 1,
                saving: false,
            });

            this.props.onReceiveNewRecord(json[0]);
        } else {
            this.setState({
                error: parseCRUDError(json),
                saving: false,
            });
        }
    };

    render() {
        const Form = this.props.formComponent;
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
                    {this.state.saving ? <ButtonProgress /> : 'Create'}
                </Button>
            </React.Fragment>
        );

        return (
            <Dialog
                title={`Create ${this.props.entityName}`}
                open={this.props.open}
                autoScrollBodyContent={true}
                actions={actions}
                contentStyle={{ width: '95%' }}
            >
                <Row>
                    <Form
                        key={this.state.createCount}
                        onFormChange={(formData) => (this.formData = formData)}
                        initialValues={this.formDefaults}
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

export default connect(({ currencies, user }) => ({ currencies, user }))(
    MainScreenCreatorDialog,
);
