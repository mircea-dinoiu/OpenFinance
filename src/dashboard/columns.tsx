import {BrokerageAccount, CashAccount} from 'dashboard/defs';
import {NumericValue} from 'app/formatters';
import {financialNum} from 'app/numbers';
import React from 'react';
import {Column} from 'react-table-6';
import {firstColumnStyles} from 'app/styles/column';
import {makeTotalFooter} from 'dashboard/makeTotalFooter';
import {createNumericColumn, createNumericColumnX} from 'app/createNumericColumn';
import {GridColDef} from '@material-ui/x-grid';

export const NameCol: Column<CashAccount> = {
    accessor: 'name',
    Header: 'Name',
    ...firstColumnStyles,
};

export const NameColX: GridColDef = {
    field: 'name',
    headerName: 'Name',
    flex: 1,
};

export const ValueColX = createNumericColumnX<CashAccount>({
    headerName: 'Value',
    field: 'total',
});

export const ValueCol = createNumericColumn<CashAccount>(
    {
        Header: 'Value',
        id: 'value',
        accessor: 'total',
        Footer: makeTotalFooter(),
    },
    {
        colorize: false,
    },
);
export const CostBasisCol = createNumericColumn<BrokerageAccount>(
    {
        Header: 'Cost Basis',
        accessor: 'costBasis',
        Footer: makeTotalFooter(),
    },
    {colorize: false},
);
export const RoiCol = createNumericColumn<BrokerageAccount>({
    Header: 'ROI',
    id: 'roi',
    accessor: (a) => a.total - a.costBasis,
    Footer: makeTotalFooter({colorize: true}),
});

export const RoiPercCol = createNumericColumn<BrokerageAccount>(
    {
        Header: 'ROI%',
        id: 'roiPerc',
        accessor: (a) => financialNum(((a.total - a.costBasis) / a.costBasis) * 100),
        Footer: ({data, column}: {data: {_original: BrokerageAccount}[]; column: {id: string}}) => {
            const costBasis = data.reduce((acc, row) => acc + row._original.costBasis, 0);
            const total = data.reduce((acc, row) => acc + row._original.total, 0);

            return (
                <NumericValue
                    colorize={true}
                    variant="tableCell"
                    value={financialNum(((total - costBasis) / costBasis) * 100)}
                    after="%"
                    before="Total: "
                />
            );
        },
    },
    {
        colorize: true,
        after: '%',
    },
);
