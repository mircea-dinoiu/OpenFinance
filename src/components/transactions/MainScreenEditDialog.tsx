import {Button, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {SmartDrawer} from 'components/drawers';
import {ButtonProgress} from 'components/loaders';

import {ErrorSnackbar} from 'components/snackbars';
import {useTransactionFormDefaults} from 'components/transactions/transformers/useTransactionFormDefaults';
import {TransactionForm, TransactionModel} from 'components/transactions/types';
import {isEqual} from 'lodash';

import {parseCRUDError} from 'parsers';
import * as React from 'react';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {Bootstrap} from 'types';

type TypeProps = {
    user: Bootstrap;
    onRequestUpdate: (
        data: TransactionModel[],
    ) => Promise<{
        data: TransactionModel[];
    }>;
    items: TransactionModel[];
    modelToForm: (model: TransactionModel) => TransactionForm;
    formToModel: (form: TransactionForm, detail: {user: Bootstrap}) => TransactionModel;
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

    useEffect(() => {
        setSaving(false);
        setError(null);
        formData.current = props.items.map(props.modelToForm);
        initialData.current = props.items.map(props.modelToForm);
    }, [props.items.map((i) => i.id).join()]);

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
                setError(parseCRUDError(e.response.data));
            } else {
                setError(e.message);
            }
        }

        setSaving(false);
    };

    const Form = props.formComponent;

    return (
        <SmartDrawer open={props.open} onClose={saving ? undefined : props.onCancel}>
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
                <Button variant="contained" disabled={saving} onClick={props.onCancel} fullWidth={true}>
                    Cancel
                </Button>
                <Button variant="contained" disabled={saving} color="primary" onClick={save} fullWidth={true}>
                    {saving ? <ButtonProgress /> : props.items.length === 1 ? 'Update' : 'Update Multiple'}
                </Button>
            </DialogActions>
        </SmartDrawer>
    );
};
