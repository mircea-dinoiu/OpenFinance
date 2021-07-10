import {Dialog, DialogContent} from '@material-ui/core';
import {renderUrlCell} from 'app/UrlCell';
import {Api} from 'app/Api';
import {TAccount} from 'accounts/defs';
import React from 'react';
import {useAccounts, useAccountsReader} from 'accounts/state';
import {EditableDataGrid} from 'app/EditableDataGrid';
import {DialogTitleWithClose} from 'app/DialogTitleWithClose';
import {renderCurrencyCell, renderCurrencyEditCell} from 'currencies/CurrencyCell';
import {renderAccountStatusCell, renderAccountStatusEditCell} from 'accounts/AccountStatusCell';
import {renderAccountTypeEditCell} from 'accounts/AccountTypeCell';

export const AccountsDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const rows = useAccounts();
    const refresh = useAccountsReader();

    return (
        <Dialog open={isOpen} onClose={onClose} fullScreen={true}>
            <DialogTitleWithClose title="Manage Accounts" onClose={onClose} />
            <DialogContent>
                <EditableDataGrid<TAccount>
                    rows={rows}
                    api={Api.moneyLocations}
                    onRefresh={refresh}
                    allowDelete={false}
                    sortModel={[
                        {field: 'status', sort: 'desc'},
                        {field: 'name', sort: 'asc'},
                    ]}
                    columns={[
                        {
                            field: 'name',
                            headerName: 'Name',
                            editable: true,
                            flex: 2,
                        },
                        {
                            field: 'status',
                            headerName: 'Status',
                            renderCell: renderAccountStatusCell,
                            renderEditCell: renderAccountStatusEditCell,
                            width: 120,
                            editable: true,
                            headerAlign: 'center',
                        },
                        {
                            field: 'currency_id',
                            headerName: 'Currency',
                            renderCell: renderCurrencyCell,
                            renderEditCell: renderCurrencyEditCell,
                            width: 100,
                            align: 'center',
                            headerAlign: 'center',
                            editable: true,
                        },
                        {
                            field: 'url',
                            headerName: 'URL',
                            renderCell: renderUrlCell,
                            editable: true,
                            flex: 2,
                        },
                        {
                            field: 'type',
                            headerName: 'Type',
                            renderEditCell: renderAccountTypeEditCell,
                            editable: true,
                            width: 150,
                        },
                        {
                            field: 'credit_limit',
                            headerName: 'Credit Limit',
                            type: 'number',
                            editable: true,
                            flex: 1,
                        },
                        {
                            field: 'credit_apr',
                            headerName: 'Credit APR',
                            type: 'number',
                            editable: true,
                            flex: 1,
                        },
                        {
                            field: 'credit_minpay',
                            headerName: 'Credit Minimum Payment',
                            type: 'number',
                            editable: true,
                            flex: 1,
                        },
                        {
                            field: 'credit_dueday',
                            headerName: 'Credit Due Day',
                            type: 'number',
                            editable: true,
                            flex: 1,
                        },
                    ]}
                />
            </DialogContent>
        </Dialog>
    );
};
