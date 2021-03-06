import {Dialog, DialogContent} from '@material-ui/core';
import {AccountTypeCell, CurrencyCell, NumberFieldCell, StatusCell, TextFieldCell, UrlCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import React from 'react';
import {useAccounts, useAccountsReader} from 'state/accounts';
import {Account} from 'types';

export const AccountsDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const rows = useAccounts();
    const refresh = useAccountsReader();

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth={false}>
            <DialogContent>
                <TableWithInlineEditing<Account>
                    data={rows}
                    api={routes.moneyLocations}
                    editableFields={[
                        'name',
                        'type',
                        'status',
                        'currency_id',
                        'credit_limit',
                        'credit_apr',
                        'credit_minpay',
                        'credit_dueday',
                    ]}
                    onRefresh={refresh}
                    allowDelete={false}
                    defaultSorted={[
                        {id: 'status', desc: true},
                        {id: 'name', desc: false},
                    ]}
                    columns={[
                        {
                            accessor: 'name',
                            Header: 'Name',
                            Cell: TextFieldCell,
                        },
                        {
                            accessor: 'status',
                            Header: 'Status',
                            Cell: StatusCell,
                            width: 100,
                        },
                        {
                            accessor: 'currency',
                            Header: 'Currency',
                            Cell: CurrencyCell,
                            width: 100,
                            style: {
                                textAlign: 'center',
                            },
                        },
                        {
                            accessor: 'url',
                            Header: 'URL',
                            Cell: UrlCell,
                        },
                        {
                            accessor: 'type',
                            Header: 'Type',
                            Cell: AccountTypeCell,
                        },
                        {
                            accessor: 'credit_limit',
                            Header: 'Credit Limit',
                            Cell: NumberFieldCell,
                        },
                        {
                            accessor: 'credit_apr',
                            Header: 'Credit APR',
                            Cell: NumberFieldCell,
                        },
                        {
                            accessor: 'credit_minpay',
                            Header: 'Credit Minimum Payment',
                            Cell: NumberFieldCell,
                        },
                        {
                            accessor: 'credit_dueday',
                            Header: 'Credit Due Day',
                            Cell: NumberFieldCell,
                        },
                    ]}
                />
            </DialogContent>
        </Dialog>
    );
};
