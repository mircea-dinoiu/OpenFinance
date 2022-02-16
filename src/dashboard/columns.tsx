import {BrokerageAccount, CashAccount} from 'dashboard/defs';
import {financialNum} from 'app/numbers';
import React from 'react';
import {createNumericColumnX} from 'app/createNumericColumn';
import {GridColDef} from '@material-ui/x-grid';
import Decimal from 'decimal.js';
import {memoize} from 'lodash';

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

export const makeAllocationCol: (total: Decimal) => GridColDef = memoize((total) =>
    createNumericColumnX<BrokerageAccount>(
        {
            headerName: 'Allocation',
            field: 'allocation',
            valueGetter: (params) => {
                const r = params.row as BrokerageAccount;

                return new Decimal(r.total)
                    .div(total)
                    .mul(100)
                    .toNumber();
            },
        },
        {
            after: '%',
            colorize: false,
        },
    ),
);
