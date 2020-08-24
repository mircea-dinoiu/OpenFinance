import {Paper} from '@material-ui/core';
import {
    AccountTypeCell,
    CurrencyCell,
    StatusCell,
    TextFieldCell,
    UrlCell,
} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingNormal} from 'defs/styles';
import React from 'react';
import {useAccountsReader, useAccounts} from 'state/accounts';
import {Account} from 'types';

export const Accounts = () => {
    const rows = useAccounts();
    const refresh = useAccountsReader();

    return (
        <Paper style={{padding: spacingNormal}}>
            <TableWithInlineEditing<Account>
                data={rows}
                api={routes.moneyLocations}
                editableFields={['name', 'type_id', 'status', 'currency_id']}
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
                        accessor: 'type_id',
                        Header: 'Type',
                        Cell: AccountTypeCell,
                    },
                ]}
            />
        </Paper>
    );
};
