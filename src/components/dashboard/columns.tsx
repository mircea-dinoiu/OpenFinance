import {BrokerageAccount, CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {firstColumnStyles, numericColumnStyles} from 'defs/styles';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {Column} from 'react-table-6';

export const makeTotalFooter = ({colorize}: {colorize?: boolean} = {}) => ({
    data,
    column,
}: {
    data: {_original: CashAccount}[];
    column: {id: string};
}) => {
    return data[0] ? (
        <>
            <strong>Total: </strong>
            <NumericValue
                colorize={colorize}
                // eslint-disable-next-line no-underscore-dangle
                currency={Number(data[0]._original.currency_id)}
                value={data.reduce((acc, row) => acc + row[column.id], 0)}
            />
        </>
    ) : null;
};

export const NameCol: Column<CashAccount> = {
    accessor: 'name',
    Header: 'Name',
    ...firstColumnStyles,
};

export const TotalCol: Column<CashAccount> = {
    Header: 'Value',
    accessor: 'total',
    Cell: ({original: a}: {original: CashAccount}) => <NumericValue currency={a.currency_id} value={a.total} />,
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
    Footer: ({data, column}: {data: {_original: CashAccount}[]; column: {id: string}}) => {
        return (
            <>
                <strong>Average: </strong>
                <NumericValue
                    colorize={true}
                    value={financialNum(data.reduce((acc, row) => acc + row[column.id], 0) / data.length)}
                    after="%"
                />
            </>
        );
    },
    ...numericColumnStyles,
};
