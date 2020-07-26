import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Radio,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconUpload from '@material-ui/icons/CloudUpload';
import {AxiosResponse} from 'axios';
import {FloatingSnackbar} from 'components/snackbars';
import {TransactionReviewAccordion} from 'components/transactions/TransactionReviewAccordion';
import {TransactionModel} from 'components/transactions/types';
import {routes} from 'defs/routes';
import {spacingLarge, spacingSmall} from 'defs/styles';
import {DropzoneArea} from 'material-ui-dropzone';
import React, {useEffect, useState} from 'react';
import {AccountStatus} from 'state/accounts';
import {useCurrencies} from 'state/currencies';
import {useBootstrap, useMoneyLocations} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

enum ImportStep {
    ACCOUNT,
    UPLOAD,
    REVIEW,
    //
    FIRST = ACCOUNT,
    LAST = REVIEW,
}

export const ImportTransactions = ({
    buttonProps,
    onSubmit,
}: {
    buttonProps: ButtonProps;
    onSubmit: (transactions: TransactionModel[]) => void;
}) => {
    const currencies = useCurrencies();
    const accounts = useMoneyLocations();
    const project = useSelectedProject();
    const bootstrap = useBootstrap();

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [accountId, setAccountId] = useState<number | null>(null);
    const account = accountId && accounts.find((a) => a.id === accountId);
    const cls = useStyles();
    const dropzoneClasses = useDropzoneStyles();
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResp, setUploadResp] = useState<AxiosResponse<{
        transactions: TransactionModel[];
    }> | null>(null);
    const currencyCode = account && currencies[account.currency_id].iso_code;
    const [excludedTransactions, setExcludedTransactions] = useState<
        Set<TransactionModel['fitid']>
    >(new Set([]));
    const steps = [
        'Select Target Account',
        'Upload Transactions',
        'Review Transactions',
    ];
    const activeStep = (() => {
        if (accountId === null) {
            return ImportStep.ACCOUNT;
        }

        if (uploadResp?.status !== 200) {
            return ImportStep.UPLOAD;
        }

        return ImportStep.REVIEW;
    })();
    const isFirstStep = activeStep === ImportStep.FIRST;
    const isLastStep = activeStep === ImportStep.LAST;
    const [transactions, setTransactions] = useState<TransactionModel[]>([]);

    const handleClose = () => {
        setDialogIsOpen(false);

        setExcludedTransactions(new Set());
        setIsUploading(false);
        setUploadResp(null);
        setFiles([]);
        setAccountId(null);
        setTransactions([]);
    };

    const upload = async () => {
        const formData = new FormData();

        formData.append('file', files[0]);

        setIsUploading(true);
        setUploadResp(null);

        const resp = await createXHR<{transactions: TransactionModel[]}>({
            url: makeUrl(routes.transactionsUpload, {
                projectId: project.id,
                accountId,
            }),
            data: formData,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setUploadResp(resp);

        if (resp.status === 200) {
            setTransactions(resp.data.transactions);
        }

        setIsUploading(false);
    };

    const importTransactions = () => {
        onSubmit(
            transactions.filter((t) => !excludedTransactions.has(t.fitid)),
        );
        handleClose();
    };

    useEffect(() => {
        if (files.length) {
            upload();
        }
    }, [files]);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                startIcon={<IconUpload />}
                onClick={() => setDialogIsOpen(true)}
                {...buttonProps}
            >
                Import Transactions
            </Button>
            <Dialog
                open={dialogIsOpen}
                onClose={isUploading ? undefined : handleClose}
            >
                <DialogTitle>Import Transactions</DialogTitle>
                <DialogContent className={cls.dialogContent}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === ImportStep.ACCOUNT && (
                        <List>
                            {accounts.map((a) =>
                                a.status === AccountStatus.OPEN ? (
                                    <ListItem
                                        key={a.id}
                                        dense
                                        button
                                        onClick={() => setAccountId(a.id)}
                                    >
                                        <ListItemIcon>
                                            <Radio
                                                checked={accountId === a.id}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={a.name} />
                                    </ListItem>
                                ) : null,
                            )}
                        </List>
                    )}
                    {activeStep === ImportStep.UPLOAD && (
                        <>
                            <DropzoneArea
                                classes={dropzoneClasses}
                                onChange={setFiles}
                                filesLimit={1}
                                acceptedFiles={['.ofx']}
                            />
                            {uploadResp && uploadResp.status !== 200 && (
                                <FloatingSnackbar
                                    severity="error"
                                    message="Something went wrong trying to import your transactions"
                                />
                            )}
                        </>
                    )}
                    {activeStep === ImportStep.REVIEW && (
                        <>
                            <div className={cls.reviewTitleGrid}>
                                <Typography variant="h6">
                                    Select the transactions to import
                                </Typography>
                                <Button
                                    color="secondary"
                                    onClick={() =>
                                        setExcludedTransactions(new Set())
                                    }
                                >
                                    All
                                </Button>
                                <Button
                                    color="secondary"
                                    onClick={() =>
                                        setExcludedTransactions(
                                            new Set(
                                                transactions.map(
                                                    (t) => t.fitid,
                                                ),
                                            ),
                                        )
                                    }
                                >
                                    None
                                </Button>
                            </div>
                            <>
                                {transactions.map((transaction) => (
                                    <TransactionReviewAccordion
                                        key={transaction.fitid as string}
                                        transaction={transaction}
                                        excluded={excludedTransactions.has(
                                            transaction.fitid,
                                        )}
                                        onExcludedChange={(excluded) => {
                                            const next = new Set(
                                                excludedTransactions,
                                            );

                                            if (excluded) {
                                                next.add(transaction.fitid);
                                            } else {
                                                next.delete(transaction.fitid);
                                            }

                                            setExcludedTransactions(next);
                                        }}
                                        currencyCode={currencyCode as string}
                                        onTransactionChange={(
                                            nextTransaction,
                                        ) => {
                                            setTransactions(
                                                transactions.map((t) =>
                                                    t.fitid ===
                                                    nextTransaction.fitid
                                                        ? nextTransaction
                                                        : t,
                                                ),
                                            );
                                        }}
                                        bootstrap={bootstrap}
                                    />
                                ))}
                            </>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {!isFirstStep && (
                        <Button
                            disabled={isUploading}
                            onClick={() => {
                                if (activeStep === ImportStep.UPLOAD) {
                                    setAccountId(null);
                                } else if (activeStep === ImportStep.REVIEW) {
                                    setFiles([]);
                                }
                            }}
                            color="primary"
                        >
                            Back
                        </Button>
                    )}
                    {isLastStep && (
                        <Button
                            onClick={importTransactions}
                            color="primary"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

const useDropzoneStyles = makeStyles({
    root: {
        padding: spacingLarge,
        marginTop: spacingSmall,
    },
});

const useStyles = makeStyles({
    dialogContent: {
        minHeight: '200px',
        minWidth: '500px',
    },
    reviewTitleGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
    },
});
