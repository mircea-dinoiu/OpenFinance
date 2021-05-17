import {BrokerageAccount, CashAccount} from 'dashboard/defs';
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

export const ValueColX = createNumericColumnX<CashAccount>(
    {
        headerName: 'Value',
        field: 'total',
    },
    {colorize: false},
);

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
export const CostBasisCol = createNumericColumnX<BrokerageAccount>(
    {
        headerName: 'Cost Basis',
        field: 'costBasis',
    },
    {colorize: false},
);
export const RoiCol = createNumericColumnX<BrokerageAccount>({
    headerName: 'ROI',
    field: 'roi',
    valueGetter: (params) => {
        const a = params.row as BrokerageAccount;

        return a.total - a.costBasis;
    },
});

export const RoiPercCol = createNumericColumnX<BrokerageAccount>(
    {
        headerName: 'ROI%',
        field: 'roiPerc',
        valueGetter: (params) => {
            const a = params.row as BrokerageAccount;

            return financialNum(((a.total - a.costBasis) / a.costBasis) * 100);
        },
    },
    {
        colorize: true,
        after: '%',
    },
);
