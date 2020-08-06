import {Paper, TextField} from '@material-ui/core';
import {MuiSelectNative} from 'components/dropdowns';
import {TableWithInlineEditing} from 'components/tables/TableWithInlineEditing';
import {routes} from 'defs/routes';
import {spacingMedium} from 'defs/styles';
import React from 'react';
import {useAccountsReader} from 'state/accounts';
import {useCurrencies} from 'state/currencies';
import {useMoneyLocations, useMoneyLocationTypes} from 'state/hooks';
import {Account} from 'types';

export const Accounts = () => {
    const rows = useMoneyLocations();
    const currencies = useCurrencies();
    const types = useMoneyLocationTypes();
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
                columns={(editor, setEditor) => [
                    {
                        accessor: 'name',
                        Header: 'Name',
                        Cell: ({original: row}) =>
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
                    {
                        accessor: 'status',
                        Header: 'Status',
                        Cell: ({original: r}) => r.status,
                    },
                    {
                        accessor: 'currency',
                        Header: 'Currency',
                        Cell: ({original: r}) => {
                            return Object.values(currencies).find(
                                (c) => c.id === r.currency_id,
                            )?.iso_code;
                        },
                    },
                    {
                        accessor: 'type',
                        Header: 'Type',
                        Cell: ({original: row}) => {
                            if (editor && editor.id === row.id) {
                                const options = types.map((t) => ({
                                    value: t.id,
                                    label: t.name,
                                }));

                                return (
                                    <MuiSelectNative<number>
                                        value={options.find(
                                            (o) => o.value === editor.type_id,
                                        )}
                                        options={options}
                                        onChange={(o) =>
                                            setEditor({
                                                ...editor,
                                                type_id: o.value,
                                            })
                                        }
                                    />
                                );
                            }

                            return Object.values(types).find(
                                (t) => t.id === row.type_id,
                            )?.name;
                        },
                    },
                ]}
            />
        </Paper>
    );
};
