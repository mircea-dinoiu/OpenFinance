import {Paper} from '@material-ui/core';
import {AccountTypeCell, CurrencyCell, NumberFieldCell, StatusCell, TextFieldCell, UrlCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingNormal} from 'defs/styles';
import React from 'react';
import {useAccounts, useAccountsReader} from 'state/accounts';
import {Account} from 'types';

export const Accounts = () => {
    const rows = useAccounts();
    const refresh = useAccountsReader();

    return (
        <Paper style={{padding: spacingNormal}}>
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
                ]}
            />
        </Paper>
    );
};
