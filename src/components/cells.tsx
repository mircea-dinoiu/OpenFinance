import {TextField} from '@material-ui/core';
import {MuiSelectNative} from 'components/dropdowns';
import React from 'react';
import {TableCellRenderer} from 'react-table-6';
import {useCurrencies} from 'state/currencies';
import {useMoneyLocationTypes} from 'state/hooks';

export const TextFieldCell: TableCellRenderer = ({
    original: row,
    columnProps,
    column,
}) => {
    const {editor, setEditor} = columnProps.rest;

    return editor && editor.id === row.id ? (
        <TextField
            value={editor[column.id as string]}
            onChange={(e) =>
                setEditor({
                    ...editor,
                    name: e.target.value,
                })
            }
            fullWidth={true}
        />
    ) : (
        row[column.id as string]
    );
};

export const CurrencyCell: TableCellRenderer = ({original: r}) => {
    const currencies = useCurrencies();

    return Object.values(currencies).find((c) => c.id === r.currency_id)
        ?.iso_code;
};

export const AccountTypeCell: TableCellRenderer = ({original: row, columnProps}) => {
    const types = useMoneyLocationTypes();
    const {editor, setEditor} = columnProps.rest;

    if (editor && editor.id === row.id) {
        const options = types.map((t) => ({
            value: t.id,
            label: t.name,
        }));

        return (
            <MuiSelectNative<number>
                value={options.find((o) => o.value === editor.type_id)}
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

    return Object.values(types).find((t) => t.id === row.type_id)?.name;
};
