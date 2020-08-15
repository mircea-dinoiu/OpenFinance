import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    ListItemText,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {formatCurrency} from 'components/formatters';
import {ExpenseForm} from 'components/transactions/ExpenseForm';
import {formToModel} from 'components/transactions/transformers/formToModel';
import {modelToForm} from 'components/transactions/transformers/modelToForm';
import {TransactionModel} from 'components/transactions/types';
import React, {useRef, useState} from 'react';
import {Bootstrap} from 'types';

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
    bootstrap: Bootstrap;
}) => {
    const [expanded, setExpanded] = useState(false);
    const formValues = useRef(modelToForm(transaction));
    const save = () => {
        onTransactionChange(
            formToModel(formValues.current, {
                user: bootstrap,
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
                            {formatCurrency(
                                transaction.sum,
                                currencyCode as string,
                            )}
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
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth={true}
                        onClick={save}
                    >
                        Save
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
