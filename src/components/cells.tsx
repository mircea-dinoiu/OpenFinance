import {TextField, Select, MenuItem} from '@material-ui/core';
import {theme} from 'defs/styles';
import _, {sortBy} from 'lodash';
import startCase from 'lodash/startCase';
import React from 'react';
import {TableCellRenderer} from 'react-table-6';
import {AccountStatus, AccountType} from 'state/accounts';
import {useCurrenciesMap} from 'state/currencies';

export const UrlCell: TableCellRenderer = ({original: row, column}) => {
    const url = row[column.id as string];

    return url ? (
        <a href={url} target="_blank" rel="noreferrer noopener">
            {url}
        </a>
    ) : null;
};

export const TextFieldCell: TableCellRenderer = ({original: row, columnProps, column}) => {
    const {editor, setEditor} = columnProps.rest;

    return editor && editor.id === row.id ? (
        <TextField
            value={editor[column.id as string]}
            onChange={(e) =>
                setEditor({
                    ...editor,
                    [column.id as string]: e.target.value,
                })
            }
            fullWidth={true}
        />
    ) : (
        row[column.id as string]
    );
};
export const NumberFieldCell: TableCellRenderer = ({original: row, columnProps, column}) => {
    const {editor, setEditor} = columnProps.rest;

    return editor && editor.id === row.id ? (
        <TextField
            type="number"
            value={editor[column.id as string]}
            onChange={(e) =>
                setEditor({
                    ...editor,
                    [column.id as string]: e.target.value,
                })
            }
            onBlur={(e) =>
                setEditor({
                    ...editor,
                    [column.id as string]: e.target.value ? Number(e.target.value) : null,
                })
            }
            fullWidth={true}
        />
    ) : (
        row[column.id as string]
    );
};

export const CurrencyCell: TableCellRenderer = ({original: row, columnProps}) => {
    const currencies = useCurrenciesMap();
    const {editor, setEditor} = columnProps.rest;

    if (editor && editor.id === row.id) {
        const options = sortBy(Object.values(currencies), 'iso_code');

        return (
            <Select
                value={editor.currency_id}
                onChange={(e) =>
                    setEditor({
                        ...editor,
                        currency_id: Number(e.target.value),
                    })
                }
            >
                {options.map((o) => (
                    <MenuItem value={o.id}>{o.iso_code}</MenuItem>
                ))}
            </Select>
        );
    }

    return Object.values(currencies).find((c) => c.id === row.currency_id)?.iso_code;
};

const ColorByStatus: Record<AccountStatus, string> = {
    [AccountStatus.OPEN]: theme.palette.success.main,
    [AccountStatus.CLOSED]: theme.palette.error.main,
    [AccountStatus.LOCKED]: theme.palette.warning.main,
};

export const StatusCell: TableCellRenderer = ({original: row, columnProps}) => {
    const {editor, setEditor} = columnProps.rest;
    const options = Object.values(AccountStatus).map((value) => ({
        value: value,
        label: startCase(value),
    }));

    return editor && editor.id === row.id ? (
        <Select
            value={editor.status}
            onChange={(e) =>
                setEditor({
                    ...editor,
                    status: e.target.value,
                })
            }
        >
            {options.map((o) => (
                <MenuItem value={o.value}>{o.label}</MenuItem>
            ))}
        </Select>
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

export const AccountTypeCell: TableCellRenderer = ({original: row, columnProps}) => {
    const types = Object.values(AccountType);
    const {editor, setEditor} = columnProps.rest;

    if (editor && editor.id === row.id) {
        const options = types.map((t) => ({
            value: t,
            label: _.capitalize(t),
        }));

        return (
            <Select
                value={editor.type}
                onChange={(e) =>
                    setEditor({
                        ...editor,
                        type: e.target.value,
                    })
                }
            >
                {options.map((o) => (
                    <MenuItem value={o.value}>{o.label}</MenuItem>
                ))}
            </Select>
        );
    }

    return Object.values(types).find((t) => t === row.type);
};
