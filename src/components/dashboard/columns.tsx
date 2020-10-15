import {BrokerageAccount, CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {lastColumnStyles} from 'defs/styles';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {Column} from 'react-table-6';

const Total = <T extends {_original: CashAccount}>({data, id}: {data: Array<T>; id: string}) => {
    return data[0] ? (
        <>
            <strong>Total: </strong>
            <NumericValue
                // eslint-disable-next-line no-underscore-dangle
                currency={Number(data[0]._original.currency_id)}
                value={data.reduce((acc, row) => acc + row[id], 0)}
            />
        </>
    ) : null;
};

const TotalFooter = ({data, column}: {data: {_original: CashAccount}[]; column: {id: string}}) => {
    return <Total data={data} id={column.id} />;
};

export const NameCol: Column<CashAccount> = {
    accessor: 'name',
    Header: 'Name',
    headerStyle: {
        textAlign: 'left',
    },
};

export const TotalCol: Column<CashAccount> = {
    Header: 'Value',
    accessor: 'total',
    Cell: ({original: a}: {original: CashAccount}) => <NumericValue currency={a.currency_id} value={a.total} />,
    Footer: TotalFooter,
    ...lastColumnStyles,
};
export const CostBasisCol: Column<BrokerageAccount> = {
    Header: 'Cost Basis',
    accessor: 'costBasis',
    Cell: ({original: a}: {original: BrokerageAccount}) => (
        <NumericValue currency={a.currency_id} value={a.costBasis} />
    ),
    Footer: TotalFooter,
    style: {
        textAlign: 'center',
    },
};
export const RoiCol: Column<BrokerageAccount> = {
    Header: 'ROI',
    id: 'roi',
    accessor: (a) => a.total - a.costBasis,
    Cell: ({original: a, value}: {original: BrokerageAccount; value: number}) => (
        <NumericValue currency={a.currency_id} value={value} />
    ),
    Footer: TotalFooter,
    style: {
        textAlign: 'center',
    },
};
export const RoiPercCol: Column<BrokerageAccount> = {
    Header: 'ROI%',
    id: 'roiPerc',
    accessor: (a) => financialNum(((a.total - a.costBasis) / a.costBasis) * 100),
    Cell: ({original: a, value}: {original: BrokerageAccount; value: number}) => <strong>{value}%</strong>,
    Footer: ({data, column}: {data: {_original: CashAccount}[]; column: {id: string}}) => {
        return (
            <>
                <strong>Average: </strong>
                {financialNum(data.reduce((acc, row) => acc + row[column.id], 0) / data.length)}%
            </>
        );
    },
    style: {
        textAlign: 'center',
    },
};
