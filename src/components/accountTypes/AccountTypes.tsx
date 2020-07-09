import {Paper, TextField} from '@material-ui/core';
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
                columns={(editor, setEditor) => [
                    {
                        id: 'name',
                        Header: 'Name',
                        accessor: (row) =>
                            editor && editor.id === row.id ? (
                                <TextField
                                    value={editor.name}
                                    onChange={(e) =>
                                        setEditor({
                                            ...editor,
                                            name: e.target.value,
                                        })
                                    }
                                    fullWidth={true}
                                />
                            ) : (
                                row.name
                            ),
                    },
                ]}
            />
        </Paper>
    );
};
