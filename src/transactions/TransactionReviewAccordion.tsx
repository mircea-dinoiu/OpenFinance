import {Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, ListItemText} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {formatCurrency} from 'app/formatters';
import {ExpenseForm} from 'transactions/ExpenseForm';
import {formToModel, modelToForm} from 'transactions/form';
import {TransactionModel} from 'transactions/defs';
import {TBootstrap} from 'users/defs';
import React, {useRef, useState} from 'react';

export const TransactionReviewAccordion = ({
    transaction,
    excluded,
    onExcludedChange,
    onTransactionChange,
    currencyCode,
    bootstrap,
}: {
    transaction: TransactionModel;
    excluded: boolean;
    onExcludedChange: (excluded: boolean) => void;
    onTransactionChange: (transaction: TransactionModel) => void;
    currencyCode: string;
    bootstrap: TBootstrap;
}) => {
    const [expanded, setExpanded] = useState(false);
    const formValues = useRef(modelToForm(transaction));
    const save = () => {
        onTransactionChange(
            formToModel(formValues.current, {
                user: bootstrap.user,
            }),
        );
        setExpanded(false);
    };

    return (
        <Accordion expanded={expanded} onChange={(e, v) => setExpanded(v)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Checkbox
                    checked={!excluded}
                    tabIndex={-1}
                    disableRipple
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    onChange={(e, checked) => onExcludedChange(!checked)}
                />
                <ListItemText
                    primary={transaction.item}
                    secondary={
                        <>
                            {new Date(transaction.created_at).toLocaleString()}
                            {' | '}
                            {formatCurrency(transaction.quantity * transaction.price, currencyCode as string)}
                        </>
                    }
                />
            </AccordionSummary>
            <AccordionDetails>
                <div>
                    {expanded && (
                        <ExpenseForm
                            initialValues={formValues.current}
                            onFormChange={(form) => (formValues.current = form)}
                            onSubmit={save}
                        />
                    )}
                    <Button variant="contained" color="secondary" fullWidth={true} onClick={save}>
                        Save
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
