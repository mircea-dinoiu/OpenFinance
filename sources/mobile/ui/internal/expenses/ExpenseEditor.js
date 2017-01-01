import React, {PureComponent} from 'react';

import {Dialog, RaisedButton} from 'material-ui';

import {Row, Col} from 'react-grid-system';

import ExpenseForm from './ExpenseForm';

import {ErrorSnackbar, SuccessSnackbar} from '../../components/snackbars';
import {ButtonProgress} from '../../components/loaders';

import dbModelToForm from './helpers/dbModelToForm';
import formToDBModel from './helpers/formToDBModel';

import routes from 'common/defs/routes';
import {fetchJSON} from 'common/utils/fetch';
import {parseCRUDError} from 'common/parsers';

export default class ExpenseEditor extends PureComponent {
    state = {
        saving: false
    };
    formData = dbModelToForm(this.props.entity);

    save = async() => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true
        });

        const response = await fetchJSON(routes.expense.update, {
            method: 'POST',
            body: {data: [formToDBModel(data, this.props)]}
        });
        const json = await response.json();

        if (response.ok) {
            this.setState({
                success: 'The expense was successfully updated',
                saving: false
            });

            setTimeout(() => {
                this.setState({
                    error: null,
                    success: null
                });
                this.props.onSave(json[0]);
            }, 500);
        } else {
            this.setState({
                error: parseCRUDError(json),
                saving: false
            });
        }
    };

    render() {
        const actions = [
            <RaisedButton
                disabled={this.state.saving}
                label="Cancel"
                primary={false}
                onTouchTap={this.props.onCancel}
                style={{marginRight: 5}}
            />,
            <RaisedButton
                disabled={this.state.saving}
                label={this.state.saving ? <ButtonProgress/> : 'Update'}
                primary={true}
                onTouchTap={this.save}
                style={{float: 'right'}}
            />
        ];

        return (
            <Dialog
                title="Edit Expense"
                open={this.props.open}
                autoScrollBodyContent={true}
                actions={actions}
                contentStyle={{width: '95%'}}
            >
                <Row>
                    <ExpenseForm
                        {...this.props.data}
                        onFormChange={formData => this.formData = formData}
                        initialValues={this.formData}
                    />
                </Row>
                <Col>
                    {this.state.error && <ErrorSnackbar key={Math.random()} message={this.state.error}/>}
                    {this.state.success && <SuccessSnackbar key={Math.random()} message={this.state.success}/>}
                </Col>
            </Dialog>
        );
    }
}