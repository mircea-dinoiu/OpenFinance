import {LinearProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {CashAccount} from 'dashboard/defs';
import {NumericValue} from 'app/formatters';
import {locales} from 'app/locales';
import React from 'react';
import {Column} from 'react-table-6';
import {numericColumnStyles} from 'app/styles/column';
import {makeTotalFooter} from 'dashboard/makeTotalFooter';

export const CreditAprCol: Column<CashAccount> = {
    Header: locales.apr,
    accessor: 'credit_apr',
    Cell: ({original: a, value}: {original: CashAccount; value: number | null}) => {
        return typeof value === 'number' ? value + '%' : null;
    },
    ...numericColumnStyles,
};

export const CreditBalanceCol: Column<CashAccount> = {
    Header: 'Balance',
    accessor: (r) => -r.total,
    id: 'balance',
    Cell: ({original, value}: {original: CashAccount; value: number}) => {
        return <NumericValue currency={original.currency_id} value={value} />;
    },
    Footer: makeTotalFooter(),
    ...numericColumnStyles,
};

export const CreditAvailableCol: Column<CashAccount> = {
    Header: 'Available',
    accessor: (r) => (r.credit_limit ?? 0) + r.total,
    id: 'available',
    Cell: ({original, value}: {original: CashAccount; value: number}) => {
        return <NumericValue currency={original.currency_id} value={value} />;
    },
    Footer: makeTotalFooter(),
    ...numericColumnStyles,
};

export const CreditUsageCol: Column<CashAccount> = {
    Header: 'Usage',
    accessor: (r) => Math.round((-r.total / (r.credit_limit ?? 0)) * 100),
    id: 'usage',
    Cell: ({original, value}: {original: CashAccount; value: number}) => <BalanceProgress progress={value} />,
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

        return <BalanceProgress progress={Math.round((totalBalance / totalLimit) * 100)} />;
    },
    ...numericColumnStyles,
};

export const CreditLimitCol: Column<CashAccount> = {
    Header: 'Credit Limit',
    accessor: 'credit_limit',
    Cell: ({original, value}: {original: CashAccount; value: number}) => {
        return <NumericValue currency={original.currency_id} value={value} />;
    },
    Footer: makeTotalFooter(),
    ...numericColumnStyles,
};

const BalanceProgress = ({progress}: {progress: number}) => {
    const cls = useStyles();

    return (
        <>
            <div className={cls.usageValue}>{progress}%</div>
            <LinearProgress className={cls.linearProgress} variant="determinate" value={progress} />
        </>
    );
};

const useStyles = makeStyles(theme => ({
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
