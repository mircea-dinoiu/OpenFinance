import {TextField} from '@material-ui/core';
import {green, orange, red} from '@material-ui/core/colors';
import {MuiSelectNative} from 'components/dropdowns';
import startCase from 'lodash/startCase';
import React from 'react';
import {TableCellRenderer} from 'react-table-6';
import {AccountStatus} from 'state/accounts';
import {useCurrenciesMap} from 'state/currencies';
import {useMoneyLocationTypes} from 'state/hooks';

export const UrlCell: TableCellRenderer = ({original: row, column}) => {
    const url = row[column.id as string];

    return url ? (
        <a href={url} target="_blank" rel="noreferrer noopener">
            {url}
        </a>
    ) : null;
};

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
    const currencies = useCurrenciesMap();

    return Object.values(currencies).find((c) => c.id === r.currency_id)
        ?.iso_code;
};

const ColorByStatus: Record<AccountStatus, string> = {
    [AccountStatus.OPEN]: green[500],
    [AccountStatus.CLOSED]: red[500],
    [AccountStatus.LOCKED]: orange[500],
};

export const StatusCell: TableCellRenderer = ({original: row, columnProps}) => {
    const {editor, setEditor} = columnProps.rest;
    const options = Object.values(AccountStatus).map((value) => ({
        value: value,
        label: startCase(value),
    }));

    return editor && editor.id === row.id ? (
        <MuiSelectNative
            options={options}
            value={options.find((o) => o.value === editor.status)}
            onChange={(o) =>
                setEditor({
                    ...editor,
                    status: o.value,
                })
            }
        />
    ) : (
        <div
            style={{
                textAlign: 'center',
                color: ColorByStatus[row.status],
                fontWeight: 500,
            }}
        >
            {startCase(row.status)}
        </div>
    );
};

export const AccountTypeCell: TableCellRenderer = ({
    original: row,
    columnProps,
}) => {
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
