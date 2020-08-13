import {Paper} from '@material-ui/core';
import {AccountTypeCell, CurrencyCell, TextFieldCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingMedium} from 'defs/styles';
import React from 'react';
import {useAccountsReader} from 'state/accounts';
import {useMoneyLocations} from 'state/hooks';
import {Account} from 'types';

export const Accounts = () => {
    const rows = useMoneyLocations();
    const refresh = useAccountsReader();

    return (
        <Paper style={{padding: spacingMedium}}>
            <TableWithInlineEditing<Account>
                data={rows}
                api={routes.moneyLocations}
                editableFields={['name', 'type_id']}
                onRefresh={refresh}
                allowDelete={false}
                defaultSorted={[{id: 'name', desc: false}]}
                columns={[
                    {
                        accessor: 'name',
                        Header: 'Name',
                        Cell: TextFieldCell,
                    },
                    {
                        accessor: 'status',
                        Header: 'Status',
                    },
                    {
                        accessor: 'currency',
                        Header: 'Currency',
                        Cell: CurrencyCell,
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
