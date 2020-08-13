import {Paper} from '@material-ui/core';
import {TextFieldCell} from 'components/cells';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingMedium} from 'defs/styles';
import React from 'react';
import {useAccountTypesReader} from 'state/accountTypes';
import {useMoneyLocationTypes} from 'state/hooks';
import {AccountType} from 'types';

export const AccountTypes = () => {
    const rows = useMoneyLocationTypes();
    const refresh = useAccountTypesReader();

    return (
        <Paper style={{padding: spacingMedium}}>
            <TableWithInlineEditing<AccountType>
                data={rows}
                api={routes.moneyLocationTypes}
                editableFields={['name']}
                onRefresh={refresh}
                allowDelete={false}
                defaultSorted={[{id: 'name', desc: false}]}
                columns={[
                    {
                        accessor: 'name',
                        Header: 'Name',
                        Cell: TextFieldCell,
                    },
                ]}
            />
        </Paper>
    );
};
