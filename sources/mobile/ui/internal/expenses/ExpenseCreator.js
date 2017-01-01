import React, {PureComponent} from 'react';
import ExpenseForm from './ExpenseForm';

import routes from 'common/defs/routes';
import {fetchJSON} from 'common/utils/fetch';
import {parseCRUDError} from 'common/parsers';

import {ErrorSnackbar, SuccessSnackbar} from '../../components/snackbars';
import {ButtonProgress} from '../../components/loaders';

import formToDBModel from './helpers/formToDBModel';
import getFormDefaults from './helpers/getFormDefaults';

import {Col} from 'react-grid-system';

import {RaisedButton} from 'material-ui';

export default class ExpenseCreator extends PureComponent {
    state = {
        createCount: 1,
        saving: false
    };
    formDefaults = getFormDefaults(this.props);
    formData = getFormDefaults(this.props);

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true
        });
        
        const response = await fetchJSON(routes.expense.create, {
            method: 'POST',
            body: {data: [formToDBModel(data, this.props)]}
        });
        const json = await response.json();
        
        if (response.ok) {
            this.setState({
                success: 'The expense was successfully created',
                createCount: this.state.createCount + 1,
                saving: false
            });
            
            this.props.onReceiveNewExpense(json[0]); 
        } else {
            this.setState({
                error: parseCRUDError(json),
                saving: false
            });
        }
    };

    render() {
        return (
            <div>
                <ExpenseForm
                    key={this.state.createCount}
                    {...this.props}
                    onFormChange={formData => this.formData = formData}
                    initialValues={this.formDefaults}
                />
                <Col><RaisedButton disabled={this.state.saving} label={this.state.saving ? <ButtonProgress/> : 'Create'} primary={true} fullWidth={true} style={{margin: '20px 0 40px'}} onTouchTap={this.save}/></Col>
                {this.state.error && <ErrorSnackbar key={Math.random()} message={this.state.error}/>}
                {this.state.success && <SuccessSnackbar key={Math.random()} message={this.state.success}/>}
            </div>
        )
    }
}