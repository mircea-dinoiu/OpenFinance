import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconUpload from '@material-ui/icons/CloudUpload';
import {AxiosResponse} from 'axios';
import {MuiReactSelect} from 'components/dropdowns';
import {FloatingSnackbar} from 'components/snackbars';
import {routes} from 'defs/routes';
import {dialog, spacingLarge} from 'defs/styles';
import {merge} from 'lodash';
import {DropzoneArea} from 'material-ui-dropzone';
import React, {useState} from 'react';
import {useMoneyLocations, useRefreshWidgetsDispatcher} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {TransactionModel} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export const ImportTransactions = ({
    buttonProps,
}: {
    buttonProps: ButtonProps;
}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [accountValue, setAccount] = useState<{
        value: number;
        label: string;
    } | null>(null);
    const accounts = useMoneyLocations();
    const cls = useStyles();
    const dropzoneClasses = useDropzoneStyles();
    const [files, setFiles] = useState<File[]>([]);
    const project = useSelectedProject();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResp, setUploadResp] = useState<AxiosResponse<{
        imported: number;
    }> | null>(null);
    const refreshWidgets = useRefreshWidgetsDispatcher();

    const handleClose = () => {
        setIsUploading(false);
        setDialogIsOpen(false);
        setUploadResp(null);
        setFiles([]);
        setAccount(null);
    };

    const submit = async () => {
        const formData = new FormData();

        formData.append('file', files[0]);

        setIsUploading(true);
        setUploadResp(null);

        const resp = await createXHR<{imported: number}>({
            url: makeUrl(routes.transactionsImport, {
                projectId: project.id,
                accountId: accountValue?.value,
            }),
            data: formData,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setUploadResp(resp);

        if (resp.status === 200) {
            refreshWidgets();
        }

        setIsUploading(false);
        setFiles([]);
        setAccount(null);
    };

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
            <Dialog open={dialogIsOpen} classes={cls}>
                <DialogTitle>Import Transactions</DialogTitle>
                <DialogContent className={cls.dialogContent}>
                    {!accountValue && (
                        <Typography variant="h4" className={cls.selectAccount}>
                            First, select the account where the transactions
                            will be imported
                        </Typography>
                    )}
                    <MuiReactSelect
                        options={accounts.map((a) => ({
                            value: a.id,
                            label: a.name,
                        }))}
                        value={accountValue}
                        onChange={(o) =>
                            setAccount(o as {value: number; label: string})
                        }
                        label="Target Account"
                    />
                    {accountValue && (
                        <DropzoneArea
                            classes={dropzoneClasses}
                            onChange={setFiles}
                            filesLimit={1}
                            acceptedFiles={['.ofx']}
                        />
                    )}
                    {uploadResp?.status != null && (
                        <FloatingSnackbar
                            severity={
                                uploadResp?.status === 200 ? 'success' : 'error'
                            }
                            message={
                                uploadResp?.status === 200
                                    ? `${uploadResp?.data?.imported} transactions were imported`
                                    : 'Something went wrong trying to import your transactions'
                            }
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isUploading}
                        onClick={handleClose}
                        color="secondary"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={submit}
                        color="primary"
                        variant="contained"
                        disabled={
                            isUploading || !accountValue || files.length === 0
                        }
                    >
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const useDropzoneStyles = makeStyles({
    root: {
        padding: spacingLarge,
        marginTop: spacingLarge,
    },
});

const useStyles = makeStyles({
    ...merge({}, dialog, {
        paper: {
            overflow: 'visible',
        },
    }),
    selectAccount: {
        marginBottom: spacingLarge,
        textAlign: 'center',
    },
    dialogContent: {
        minHeight: '200px',
        minWidth: '500px',
        overflow: 'visible',
    },
});
