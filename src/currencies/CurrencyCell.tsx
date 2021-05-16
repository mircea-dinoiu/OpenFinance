import {GridColDef, GridCellParams} from '@material-ui/x-grid';
import {useCurrenciesMap} from 'currencies/state';
import {TableCellRenderer} from 'react-table-6';
import {sortBy} from 'lodash';
import {Select, MenuItem, Menu, TextField} from '@material-ui/core';
import React from 'react';
import {Autocomplete} from '@material-ui/lab';
import {TCurrency} from 'currencies/defs';

export const renderCurrencyCell: GridColDef['renderCell'] = (params) => {
    return <CurrencyCell {...params} />;
};

const CurrencyCell = (params: GridCellParams) => {
    const currencies = useCurrenciesMap();

    return <>{Object.values(currencies).find((c) => c.id === params.value)?.iso_code}</>;
};

export const renderCurrencyEditCell: GridColDef['renderEditCell'] = (params) => {
    return <CurrencyEditCell {...params} />;
};

const CurrencyEditCell = (props: GridCellParams) => {
    const {id, value, api, field} = props;
    const currencies = useCurrenciesMap();
    const options = sortBy(Object.values(currencies), 'iso_code');

    return (
        <Autocomplete<TCurrency, false, true>
            getOptionLabel={(o) => o.iso_code}
            defaultValue={currencies[value as string]}
            options={options}
            open={true}
            fullWidth={true}
            onChange={(e, o) => {
                api.setEditCellProps({
                    id,
                    field,
                    props: {
                        value: o?.id,
                    },
                });
            }}
            disableClearable={true}
            renderInput={(params) => <TextField {...params} />}
        />
    );
};
