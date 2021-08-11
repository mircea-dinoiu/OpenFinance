import {GridCellParams} from '@material-ui/x-grid';
import startCase from 'lodash/startCase';
import React from 'react';
import {AccountStatus} from 'accounts/defs';
import {Theme, TextField} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {PaletteColor} from '@material-ui/core/styles/createPalette';
import {Autocomplete} from '@material-ui/lab';

export const renderAccountStatusCell = (params: GridCellParams) => {
    const status = params.value as AccountStatus;

    return <StatusStyled status={status}>{startCase(status)}</StatusStyled>;
};

const ColorByStatus: Record<AccountStatus, (theme: Theme) => PaletteColor> = {
    [AccountStatus.OPEN]: (theme) => theme.palette.success,
    [AccountStatus.CLOSED]: (theme) => theme.palette.error,
    [AccountStatus.LOCKED]: (theme) => theme.palette.warning,
};

const StatusStyled = styled('div')((props: {status: AccountStatus; theme: Theme}) => ({
    background: ColorByStatus[props.status](props.theme).main,
    textAlign: 'center',
    color: ColorByStatus[props.status](props.theme).contrastText,
    fontWeight: 500,
    width: '100%',
}));

export const renderAccountStatusEditCell = (params: GridCellParams) => {
    return <AccountStatusEditCell {...params} />;
};

const AccountStatusEditCell = (props: GridCellParams) => {
    const {id, value, api, field} = props;

    return (
        <Autocomplete<AccountStatus, false, true>
            getOptionLabel={(o) => startCase(o)}
            defaultValue={value as AccountStatus}
            options={Object.values(AccountStatus)}
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
