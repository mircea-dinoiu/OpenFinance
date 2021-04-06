import {Button, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {SmartDrawer} from 'app/drawers';
import {ButtonProgress} from 'app/loaders';

import {parseCrudError} from 'app/parseCrudError';

import {ErrorSnackbar} from 'app/snackbars';
import {isEqual} from 'lodash';
import * as React from 'react';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {TransactionForm, TransactionModel} from 'transactions/defs';
import {useTransactionFormDefaults} from 'transactions/useTransactionFormDefaults';
import {Bootstrap, User} from 'users/defs';

type TypeProps = {
    user: User;
    onRequestUpdate: (
        data: TransactionModel[],
    ) => Promise<{
        data: TransactionModel[];
    }>;
    items: TransactionModel[];
    modelToForm: (model: TransactionModel) => TransactionForm;
    formToModel: (form: TransactionForm, detail: {user: User}) => TransactionModel;
    entityName: string;
    formComponent: React.ComponentType<{
        initialValues: TransactionForm;
        onFormChange: (form: TransactionForm) => void;
        onSubmit: () => void;
    }>;
    open: boolean;
    onCancel: () => void;
    onSave: () => void;
};

export const MainScreenEditDialog = (props: TypeProps) => {
    const [saving, setSaving] = useState(true);
    const [error, setError] = useState<ReactNode>(null);
    const formData = useRef(props.items.map(props.modelToForm));
    const initialData = useRef(props.items.map(props.modelToForm));
    const formDefaults = useTransactionFormDefaults();

    const resetForm = () => {
        setSaving(false);
        setError(null);
        formData.current = props.items.map(props.modelToForm);
        initialData.current = props.items.map(props.modelToForm);
    };

    const handleCancel = () => {
        props.onCancel();
        resetForm();
    };

    useEffect(() => {
        resetForm();
    }, [JSON.stringify(props.items)]);

    const getUpdates = () => {
        const updates = {};

        for (const key in initialData.current[0]) {
            if (!isEqual(initialData.current[0][key], formData.current[0][key])) {
                updates[key] = formData.current[0][key];
            }
        }

        return updates;
    };

    const save = async () => {
        const data = formData.current;

        setError(null);
        setSaving(true);

        try {
            const updates = getUpdates();

            console.info('[UPDATES]', updates);

            await props.onRequestUpdate(
                data.map((each) =>
                    props.formToModel(
                        {...each, ...updates},
                        {
                            user: props.user,
                        },
                    ),
                ),
            );

            props.onSave();
        } catch (e) {
            if (e.response) {
                setError(parseCrudError(e.response.data));
            } else {
                setError(e.message);
            }
        }

        setSaving(false);
    };

    const Form = props.formComponent;

    return (
        <SmartDrawer open={props.open} onClose={saving ? undefined : handleCancel}>
            <DialogTitle>{`Edit ${props.entityName}${props.items.length === 1 ? '' : 's'}`}</DialogTitle>

            <DialogContent dividers={true}>
                <Form
                    onFormChange={(nextFormData) => (formData.current[0] = nextFormData)}
                    initialValues={formData.current[0] ?? formDefaults}
                    onSubmit={save}
                />
                {error && <ErrorSnackbar message={error} />}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    disabled={saving}
                    onClick={() => {
                        handleCancel();
                        resetForm();
                    }}
                    fullWidth={true}
                >
                    Cancel
                </Button>
                <Button variant="contained" disabled={saving} color="primary" onClick={save} fullWidth={true}>
                    {saving ? <ButtonProgress /> : props.items.length === 1 ? 'Update' : 'Update Multiple'}
                </Button>
            </DialogActions>
        </SmartDrawer>
    );
};
