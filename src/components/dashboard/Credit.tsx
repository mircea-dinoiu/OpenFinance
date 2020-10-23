import {LinearProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {numericColumnStyles, spacingNormal, spacingSmall} from 'defs/styles';
import React from 'react';
import {Column} from 'react-table-6';
import {AccountStatus, useAccounts} from 'state/accounts';

export const BalanceCol: Column<CashAccount> = {
    Header: 'Balance',
    accessor: (r) => -r.total,
    id: 'balance',
    Cell: ({original: a, value}: {original: CashAccount; value: number}) => {
        return <BalanceProgress currencyId={a.currency_id} total={a.credit_limit ?? 0} value={value} />;
    },
    Footer: ({data, column}: {data: {_original: CashAccount}[]; column: {id: string}}) => {
        const allAccounts = useAccounts();

        if (!data[0]) {
            return null;
        }

        // eslint-disable-next-line no-underscore-dangle
        const currencyId = Number(data[0]._original.currency_id);
        const accounts = allAccounts.filter((a) => a.status !== AccountStatus.CLOSED && a.currency_id === currencyId);
        const total = accounts.reduce((acc, a) => (acc += a.credit_limit ?? 0), 0);
        const usage = data.reduce((acc, row) => acc + row[column.id], 0);

        return <BalanceProgress currencyId={currencyId} total={total} value={usage} />;
    },
    ...numericColumnStyles,
};

const BalanceProgress = ({total, value, currencyId}: {total: number; value: number; currencyId: number}) => {
    const progress = (value / total) * 100;
    const cls = useStyles();

    return (
        <>
            <div className={cls.values}>
                <NumericValue currency={currencyId} value={value} />
            </div>

            <LinearProgress className={cls.linearProgress} variant="determinate" value={progress} />
            <div className={clsx(cls.values, cls.legend)}>
                <NumericValue value={Math.round(progress)} after="%" />
                <NumericValue currency={currencyId} value={total} />
            </div>
        </>
    );
};

const useStyles = makeStyles({
    values: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridGap: spacingSmall,
        textAlign: 'left',
        alignItems: 'center',
    },
    legend: {
        fontSize: 12,
    },
    linearProgress: {
        height: spacingNormal,
    },
});
