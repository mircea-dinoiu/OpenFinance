import {Button, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {SmartDrawer} from 'app/drawers';
import {ButtonProgress} from 'app/loaders';

import {ErrorSnackbar} from 'app/snackbars';
import {useTransactionFormDefaults} from 'transactions/useTransactionFormDefaults';
import {useBootstrap} from 'users/state';
import {parseCrudError} from 'app/parseCrudError';
import * as React from 'react';
import {TransactionForm} from './form';

type TypeProps = {
    formToModel: Function;
    entityName: string;
    onSave: () => void;
    formComponent: React.ComponentType<{
        initialValues: TransactionForm;
        onFormChange: (form: TransactionForm) => void;
        onSubmit: () => void;
    }>;
    onRequestCreate: Function;
    onCancel: () => void;
    open: boolean;
};

export const MainScreenCreatorDialog = (props: TypeProps) => {
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<React.ReactNode>(null);
    const user = useBootstrap();
    const formDefaults = useTransactionFormDefaults();
    const [formData, setFormData] = React.useState(useTransactionFormDefaults());

    const save = async () => {
        const data = formData;

        setError(null);
        setSaving(true);

        try {
            await props.onRequestCreate([
                props.formToModel(data, {
                    user,
                }),
            ]);

            setSaving(false);

            props.onSave();
        } catch (e) {
            if (e.response) {
                setError(parseCrudError(e.response.data));
                setSaving(false);
            } else {
                setError(e.message);
                setSaving(false);
            }
        }
    };

    const Form = props.formComponent;

    return (
        <SmartDrawer open={props.open} onClose={saving ? undefined : props.onCancel}>
            <DialogTitle>{`Create ${props.entityName}`}</DialogTitle>

            <DialogContent dividers={true}>
                <Form
                    onFormChange={(nextFormData) => setFormData(nextFormData)}
                    initialValues={formDefaults}
                    onSubmit={save}
                />
                {error && <ErrorSnackbar message={error} />}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" disabled={saving} onClick={props.onCancel} fullWidth={true}>
                    Cancel
                </Button>
                <Button variant="contained" disabled={saving} color="primary" onClick={save} fullWidth={true}>
                    {saving ? <ButtonProgress /> : 'Create'}
                </Button>
            </DialogActions>
        </SmartDrawer>
    );
};
