import {LinearProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {CashAccount} from 'dashboard/defs';
import {locales} from 'app/locales';
import React from 'react';
import {createNumericColumnX} from 'app/createNumericColumn';
import {GridColDef} from '@material-ui/x-grid';

export const CreditAprCol: GridColDef = {
    headerName: locales.apr,
    field: 'credit_apr',
    renderCell: (params) => {
        const value = params.value as number | null;

        return <>{typeof value === 'number' ? value + '%' : null}</>;
    },
    headerAlign: 'right',
    align: 'right',
};

export const mapCashAccountToBalance = (r: CashAccount) => {
    return r.total ? -r.total : 0;
};

export const CreditBalanceCol = createNumericColumnX<CashAccount>(
    {
        headerName: 'Balance',
        valueGetter: (params) => mapCashAccountToBalance(params.row as CashAccount),
        field: 'balance',
    },
    {
        colorize: false,
    },
);

export const CreditAvailableCol = createNumericColumnX<CashAccount>(
    {
        headerName: 'Available',
        valueGetter: (params) => {
            const r = params.row as CashAccount;

            return (r.credit_limit ?? 0) + r.total;
        },
        field: 'available',
    },
    {
        colorize: false,
    },
);

export const CreditUsageCol: GridColDef = {
    headerName: 'Usage',
    valueGetter: (params) => {
        const r = params.row as CashAccount;

        return r.credit_limit ? Math.round((-r.total / (r.credit_limit ?? 0)) * 100) : null;
    },
    field: 'usage',
    cellClassName: 'positionRelative',
    renderCell: (params) => {
        const value = params.value as number | null;

        return <>{value === null ? value : <BalanceProgress progress={value} />}</>;
    },
    align: 'right',
    headerAlign: 'right',
};

export const CreditLimitCol = createNumericColumnX<CashAccount>(
    {
        headerName: 'Credit Limit',
        field: 'credit_limit',
    },
    {
        colorize: false,
    },
);

export const BalanceProgress = ({progress}: {progress: number}) => {
    const cls = useStyles();

    return (
        <>
            <div className={cls.usageValue}>{progress}%</div>
            <LinearProgress className={cls.linearProgress} variant="determinate" value={progress} />
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    values: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: theme.spacing(1),
        textAlign: 'left',
        alignItems: 'center',
    },
    legend: {
        fontSize: 12,
    },
    usageValue: {
        position: 'relative',
        zIndex: 2,
    },
    linearProgress: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
    },
}));
