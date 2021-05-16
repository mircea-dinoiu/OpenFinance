import {GridCellParams} from '@material-ui/x-grid';
import {TextField, capitalize} from '@material-ui/core';
import React from 'react';
import {AccountType} from 'accounts/defs';
import {Autocomplete} from '@material-ui/lab';

export const renderAccountTypeEditCell = (params: GridCellParams) => <AccountTypeEditCell {...params} />;

const AccountTypeEditCell = (props: GridCellParams) => {
    const {id, value, api, field} = props;

    return (
        <Autocomplete<AccountType, false, true>
            getOptionLabel={(o) => capitalize(o)}
            defaultValue={value as AccountType}
            options={Object.values(AccountType)}
            open={true}
            fullWidth={true}
            onChange={(e, o) => {
                api.setEditCellProps({
                    id,
                    field,
                    props: {
                        value: o,
                    },
                });
            }}
            disableClearable={true}
            renderInput={(params) => <TextField {...params} />}
        />
    );
};
