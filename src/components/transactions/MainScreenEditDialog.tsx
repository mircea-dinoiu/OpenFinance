import {isEqual} from 'lodash';
import * as React from 'react';

import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

import {ErrorSnackbar, SuccessSnackbar} from 'components/snackbars';
import {ButtonProgress} from 'components/loaders';

import {parseCRUDError} from 'parsers';
import {dialog} from 'defs/styles';
import {TransactionForm, TransactionModel, Bootstrap} from 'types';

type TypeProps = {
    user: Bootstrap;
    onRequestUpdate: (
        data: TransactionModel[],
    ) => Promise<{
        data: TransactionModel[];
    }>;
    items: TransactionModel[];
    modelToForm: (
        model: TransactionModel,
    ) => TransactionForm;
    formToModel: (
        form: TransactionForm,
        detail: {user: Bootstrap},
    ) => TransactionModel;
    entityName: string;
    formComponent: React.ComponentType<{
        initialValues: TransactionForm;
        onFormChange: (TypeTransactionForm) => void;
    }>;
    open: boolean;
    classes: {};
    onCancel: () => void;
    onSave: ({}) => void;
};

class MainScreenEditDialogWrapped extends React.PureComponent<
    TypeProps,
    {
        saving: boolean;
        success: React.ReactNode;
        error: React.ReactNode;
    }
> {
    state = {
        saving: false,
        success: null,
        error: null,
    };
    formData = this.props.items.map(this.props.modelToForm);
    initialData = this.props.items.map(this.props.modelToForm);

    getUpdates() {
        const updates = {};

        for (const key in this.initialData[0]) {
            if (!isEqual(this.initialData[0][key], this.formData[0][key])) {
                updates[key] = this.formData[0][key];
            }
        }

        return updates;
    }

    save = async () => {
        const data = this.formData;

        this.setState({
            error: null,
            success: null,
            saving: true,
        });

        try {
            const updates = this.getUpdates();

            console.info('[UPDATES]', updates);

            const response = await this.props.onRequestUpdate(
                data.map((each) =>
                    this.props.formToModel(
                        {...each, ...updates},
                        {
                            user: this.props.user,
                        },
                    ),
                ),
            );
            const json = response.data;

            this.setState({
                success: `The ${this.props.entityName} was successfully updated`,
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
                <DialogTitle>{`Edit ${this.props.entityName}${
                    this.props.items.length === 1 ? '' : 's'
                }`}</DialogTitle>
                <DialogContent style={{overflow: 'visible'}}>
                    <Form
                        onFormChange={(formData) =>
                            (this.formData[0] = formData)
                        }
                        initialValues={this.formData[0]}
                    />
                    {this.state.error && (
                        <ErrorSnackbar message={this.state.error} />
                    )}
                    {this.state.success && (
                        <SuccessSnackbar message={this.state.success} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        onClick={this.props.onCancel}
                        style={{marginRight: 5}}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={this.state.saving}
                        color="primary"
                        onClick={this.save}
                        style={{float: 'right'}}
                    >
                        {this.state.saving ? (
                            <ButtonProgress />
                        ) : this.props.items.length === 1 ? (
                            'Update'
                        ) : (
                            'Update Multiple'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export const MainScreenEditDialog = withStyles(dialog)(
    MainScreenEditDialogWrapped,
);
