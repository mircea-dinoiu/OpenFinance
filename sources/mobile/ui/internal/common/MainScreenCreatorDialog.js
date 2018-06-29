// @flow
import React, {PureComponent} from 'react';
import {fetchJSON} from 'common/utils/fetch';
import {parseCRUDError} from 'common/parsers';

import {ErrorSnackbar, SuccessSnackbar} from '../../components/snackbars';
import {ButtonProgress} from '../../components/loaders';

import {Col, Row} from 'react-grid-system';

import {Dialog, RaisedButton} from 'material-ui';
import {connect} from 'react-redux';

class MainScreenCreatorDialog extends PureComponent {
    state = {
        createCount: 1,
        saving: false
    };
    props: {
        getFormDefaults: Function,
        formToModel: Function,
        entityName: string,
        onReceiveNewRecord: Function,
        formComponent: any,
        api: {
            create: string
        }
    };
    formDefaults = this.props.getFormDefaults(this.props);
    formData = this.props.getFormDefaults(this.props);

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true
        });

        const response = await fetchJSON(this.props.api.create, {
            method: 'POST',
            body: {data: [this.props.formToModel(data, this.props)]}
        });
        const json = await response.json();

        if (response.ok) {
            this.setState({
                success: `The ${
                    this.props.entityName
                } was successfully created`,
                createCount: this.state.createCount + 1,
                saving: false
            });

            this.props.onReceiveNewRecord(json[0]);
        } else {
            this.setState({
                error: parseCRUDError(json),
                saving: false
            });
        }
    };

    render() {
        const Form = this.props.formComponent;
        const actions = (
            <React.Fragment>
                <RaisedButton
                    disabled={this.state.saving}
                    label="Cancel"
                    primary={false}
                    onTouchTap={this.props.onCancel}
                    style={{marginRight: 5}}
                />
                <RaisedButton
                    disabled={this.state.saving}
                    label={this.state.saving ? <ButtonProgress /> : 'Create'}
                    primary={true}
                    onTouchTap={this.save}
                    style={{float: 'right'}}
                />
            </React.Fragment>
        );

        return (
            <Dialog
                title={`Create ${this.props.entityName}`}
                open={this.props.open}
                autoScrollBodyContent={true}
                actions={actions}
                contentStyle={{width: '95%'}}
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

export default connect(({currencies, user}) => ({currencies, user}))(
    MainScreenCreatorDialog
);
