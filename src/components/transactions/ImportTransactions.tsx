import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
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
import {Api} from 'defs/Api';
import {DropzoneArea} from 'material-ui-dropzone';
import React, {useEffect, useState} from 'react';
import {useOpenAccounts} from 'domain/accounts/state';
import {useCurrenciesMap} from 'domain/currencies/state';
import {useBootstrap} from 'state/hooks';
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

export const ImportTransactions = ({onSubmit}: {onSubmit: (transactions: TransactionModel[]) => void}) => {
    const currencies = useCurrenciesMap();
    const accounts = useOpenAccounts();
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
    const [excludedTransactions, setExcludedTransactions] = useState<Set<TransactionModel['fitid']>>(new Set([]));
    const steps = ['Select Target Account', 'Upload Transactions', 'Review Transactions'];
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
            url: makeUrl(Api.transactionsUpload, {
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
        onSubmit(transactions.filter((t) => !excludedTransactions.has(t.fitid)));
        handleClose();
    };

    useEffect(() => {
        if (files.length) {
            upload();
        }
    }, [files]);

    return (
        <>
            <Fab variant="extended" color="primary" onClick={() => setDialogIsOpen(true)} size="small">
                <IconUpload />
            </Fab>
            <Dialog open={dialogIsOpen} onClose={isUploading ? undefined : handleClose}>
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
                            {accounts.map((a) => (
                                <ListItem key={a.id} dense button onClick={() => setAccountId(a.id)}>
                                    <ListItemIcon>
                                        <Radio checked={accountId === a.id} />
                                    </ListItemIcon>
                                    <ListItemText primary={a.name} />
                                </ListItem>
                            ))}
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
                                <Typography variant="h6">Select the transactions to import</Typography>
                                <Button color="secondary" onClick={() => setExcludedTransactions(new Set())}>
                                    All
                                </Button>
                                <Button
                                    color="secondary"
                                    onClick={() => setExcludedTransactions(new Set(transactions.map((t) => t.fitid)))}
                                >
                                    None
                                </Button>
                            </div>
                            <>
                                {transactions.map((transaction) => (
                                    <TransactionReviewAccordion
                                        key={transaction.fitid as string}
                                        transaction={transaction}
                                        excluded={excludedTransactions.has(transaction.fitid)}
                                        onExcludedChange={(excluded) => {
                                            const next = new Set(excludedTransactions);

                                            if (excluded) {
                                                next.add(transaction.fitid);
                                            } else {
                                                next.delete(transaction.fitid);
                                            }

                                            setExcludedTransactions(next);
                                        }}
                                        currencyCode={currencyCode as string}
                                        onTransactionChange={(nextTransaction) => {
                                            setTransactions(
                                                transactions.map((t) =>
                                                    t.fitid === nextTransaction.fitid ? nextTransaction : t,
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
                        <Button onClick={importTransactions} color="primary" variant="contained">
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

const useDropzoneStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(1),
    },
}));

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
