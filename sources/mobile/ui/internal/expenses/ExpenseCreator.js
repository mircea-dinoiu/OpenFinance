import React, {PureComponent} from 'react';
import ExpenseForm from './ExpenseForm';
import routes from 'common/defs/routes';
import fetch from 'common/utils/fetch';
import formToDBModel from './formToDBModel';
import {ErrorSnackbar, SuccessSnackbar} from '../../components/snackbars';

export default class ExpenseCreator extends PureComponent {
    state = {
        createCount: 1
    };

    save = async (data) => {
        const response = await fetch(routes.expense.create, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: [formToDBModel(data, this.props)]})
        });
        const json = await response.json();
        
        if (response.ok) {
            this.setState({
                success: 'The expense was successfully created',
                createCount: this.state.createCount + 1
            })
        } else {
            let error = json;

            if (Array.isArray(json)) {
                error = (
                    <div>
                        {Object.values(json[0]).map(each => each[0]).map(message => <div key={message}>{message}</div>)}
                    </div>
                );
            }

            this.setState({
                error
            });
        }
    };

    render() {
        return (
            <div>
                <ExpenseForm key={this.state.createCount} {...this.props} onSave={this.save}/>
                {this.state.error && <ErrorSnackbar key={Math.random()} message={this.state.error}/>}
                {this.state.success && <SuccessSnackbar key={Math.random()} message={this.state.success}/>}
            </div>
        )
    }
}