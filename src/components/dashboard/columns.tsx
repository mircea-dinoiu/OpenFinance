import {BrokerageAccount, CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {firstColumnStyles, numericColumnStyles} from 'defs/styles';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {Column} from 'react-table-6';
import {makeTotalFooter} from './makeTotalFooter';

export const NameCol: Column<CashAccount> = {
    accessor: 'name',
    Header: 'Name',
    ...firstColumnStyles,
};

export const ValueCol: Column<CashAccount> = {
    Header: 'Value',
    id: 'value',
    accessor: 'total',
    Cell: ({original: a}: {original: CashAccount}) => <NumericValue currency={a.currency_id} value={a.total} colorize={a.total === 0} />,
    Footer: makeTotalFooter(),
    ...numericColumnStyles,
};
export const CostBasisCol: Column<BrokerageAccount> = {
    Header: 'Cost Basis',
    accessor: 'costBasis',
    Cell: ({original: a}: {original: BrokerageAccount}) => (
        <NumericValue currency={a.currency_id} value={a.costBasis} />
    ),
    Footer: makeTotalFooter(),
    ...numericColumnStyles,
};
export const RoiCol: Column<BrokerageAccount> = {
    Header: 'ROI',
    id: 'roi',
    accessor: (a) => a.total - a.costBasis,
    Cell: ({original: a, value}: {original: BrokerageAccount; value: number}) => (
        <NumericValue colorize={true} currency={a.currency_id} value={value} />
    ),
    Footer: makeTotalFooter({colorize: true}),
    ...numericColumnStyles,
};
export const RoiPercCol: Column<BrokerageAccount> = {
    Header: 'ROI%',
    id: 'roiPerc',
    accessor: (a) => financialNum(((a.total - a.costBasis) / a.costBasis) * 100),
    Cell: ({original: a, value}: {original: BrokerageAccount; value: number}) => (
        <NumericValue colorize={true} value={value} after="%" />
    ),
    Footer: ({data, column}: {data: {_original: BrokerageAccount}[]; column: {id: string}}) => {
        const costBasis = data.reduce((acc, row) => acc + row._original.costBasis, 0);
        const total = data.reduce((acc, row) => acc + row._original.total, 0);

        return (
            <>
                <strong>Total: </strong>
                <NumericValue colorize={true} value={financialNum(((total - costBasis) / costBasis) * 100)} after="%" />
            </>
        );
    },
    ...numericColumnStyles,
};
