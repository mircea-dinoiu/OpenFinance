import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Popover,
    PopoverProps,
    DrawerProps,
    Divider,
} from '@material-ui/core';
import {SmartDrawer} from 'app/drawers';
import {ButtonProgress} from 'app/loaders';

import {parseCrudError} from 'app/parseCrudError';

import {ErrorSnackbar} from 'app/snackbars';
import {isEqual} from 'lodash';
import * as React from 'react';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {TransactionModel} from 'transactions/defs';
import {useTransactionFormDefaults} from 'transactions/useTransactionFormDefaults';
import {modelToForm, formToModel} from './form';
import {ExpenseForm} from 'transactions/ExpenseForm';
import {useUser} from 'users/state';
import {TTransactionsContext} from 'transactions/TransactionsContext';

export type TransactionEditorProps = {
    entityName: string;
    onRequestUpdate: (
        data: TransactionModel[],
    ) => Promise<{
        data: TransactionModel[];
    }>;
    items: TransactionModel[];
    onClose: () => void;
    onClosed?: () => void;
    onSave: () => void;
    variant: 'drawer' | 'popover';
    drawerProps?: Partial<DrawerProps>;
    popoverProps?: Partial<PopoverProps>;
    fieldToEdit?: TTransactionsContext['state']['fieldToEdit'];
};

export const MainScreenEditDialog = ({drawerProps = {}, popoverProps = {}, ...props}: TransactionEditorProps) => {
    const [saving, setSaving] = useState(true);
    const [error, setError] = useState<ReactNode>(null);
    const formData = useRef(props.items.map(modelToForm));
    const initialData = useRef(props.items.map(modelToForm));
    const formDefaults = useTransactionFormDefaults();
    const user = useUser();

    const resetForm = () => {
        setSaving(false);
        setError(null);
        formData.current = props.items.map(modelToForm);
        initialData.current = props.items.map(modelToForm);
    };

    const handleCancel = () => {
        props.onClose();
        resetForm();
    };

    useEffect(() => {
        resetForm();
    }, [popoverProps.anchorEl, JSON.stringify(props.items)]);

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
                    formToModel(
                        {...each, ...updates},
                        {
                            user,
                        },
                    ),
                ),
            );

            props.onSave();
            props.onClose();
        } catch (e) {
            if (e.response) {
                setError(parseCrudError(e.response.data));
            } else {
                setError(e.message);
            }
        }

        setSaving(false);
    };
    const content = (
        <DialogContent dividers={true}>
            <ExpenseForm
                fieldToEdit={props.fieldToEdit}
                onFormChange={(nextFormData) => (formData.current[0] = nextFormData)}
                initialValues={props.items[0] ? modelToForm(props.items[0]) : formDefaults}
                onSubmit={save}
            />
            {error && <ErrorSnackbar message={error} />}
        </DialogContent>
    );
    const actions = (
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
    );

    const onClose = saving ? undefined : handleCancel;

    if (props.variant === 'drawer') {
        return (
            <SmartDrawer open={false} {...drawerProps} onClose={onClose}>
                <DialogTitle>{`Edit ${props.entityName}${props.items.length === 1 ? '' : 's'}`}</DialogTitle>

                {content}

                {actions}
            </SmartDrawer>
        );
    }

    return (
        <Popover
            open={Boolean(popoverProps.anchorEl)}
            anchorEl={popoverProps.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={onClose}
        >
            {content}
            <Divider />
            {actions}
        </Popover>
    );
};
