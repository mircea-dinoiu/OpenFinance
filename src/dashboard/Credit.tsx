import {LinearProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {CashAccount} from 'dashboard/defs';
import {locales} from 'app/locales';
import React from 'react';
import {Column} from 'react-table-6';
import {numericColumnStyles} from 'app/styles/column';
import {makeTotalFooter} from 'dashboard/makeTotalFooter';
import {createNumericColumn} from 'app/createNumericColumn';

export const CreditAprCol: Column<CashAccount> = {
    Header: locales.apr,
    accessor: 'credit_apr',
    Cell: ({original: a, value}: {original: CashAccount; value: number | null}) => {
        return typeof value === 'number' ? value + '%' : null;
    },
    ...numericColumnStyles,
};

export const CreditBalanceCol = createNumericColumn<CashAccount>(
    {
        Header: 'Balance',
        accessor: (r) => (r.total ? -r.total : 0),
        id: 'balance',
        Footer: makeTotalFooter(),
    },
    {
        colorize: false,
    },
);

export const CreditAvailableCol = createNumericColumn<CashAccount>(
    {
        Header: 'Available',
        accessor: (r) => (r.credit_limit ?? 0) + r.total,
        id: 'available',
        Footer: makeTotalFooter(),
    },
    {
        colorize: false,
    },
);

export const CreditUsageCol: Column<CashAccount> = {
    Header: 'Usage',
    accessor: (r) => (r.credit_limit ? Math.round((-r.total / (r.credit_limit ?? 0)) * 100) : null),
    id: 'usage',
    Cell: ({original, value}: {original: CashAccount; value: number | null}) =>
        value === null ? value : <BalanceProgress progress={value} />,
    getProps: () => ({style: {position: 'relative'}}),
    Footer: ({
        data,
        column,
    }: {
        data: {_original: CashAccount; balance: number; credit_limit: number}[];
        column: {id: string};
    }) => {
        if (!data[0]) {
            return null;
        }

        const totalBalance = data.reduce((acc, d) => acc + d.balance, 0);
        const totalLimit = data.reduce((acc, d) => acc + (d._original.credit_limit ?? 0), 0);
        const progress = Math.round((totalBalance / totalLimit) * 100);

        return progress !== Infinity && <BalanceProgress progress={progress} />;
    },
    ...numericColumnStyles,
};

export const CreditLimitCol = createNumericColumn<CashAccount>(
    {
        Header: 'Credit Limit',
        accessor: 'credit_limit',
        Footer: makeTotalFooter(),
    },
    {
        colorize: false,
    },
);

const BalanceProgress = ({progress}: {progress: number}) => {
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
