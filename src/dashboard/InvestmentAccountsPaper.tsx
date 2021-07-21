import IconStock from '@material-ui/icons/TrendingUp';
import {CostBasisCol, RoiCol, RoiPercCol, NameColX, ValueColX, makeAllocationCol} from 'dashboard/columns';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {BrokerageAccount} from 'dashboard/defs';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import {groupBy} from 'lodash';
import React, {useState} from 'react';
import {DashboardAccordion} from 'dashboard/DashboardAccordion';
import {XGrid} from '@material-ui/x-grid';
import {useGridFooter} from './makeTotalFooter';
import {NumericValue} from '../app/formatters';
import {financialNum} from '../app/numbers';
import Decimal from 'decimal.js';

export const InvestmentAccountsPaper = ({
    classes,
    brokerageWithTotal,
}: {
    brokerageWithTotal: BrokerageAccount[];
    classes: Record<string, string>;
}) => {
    const brokerageWithTotalGroupedByCurrencyId = groupBy(brokerageWithTotal, 'currency_id');
    const currencyIds = Object.keys(brokerageWithTotalGroupedByCurrencyId);
    const [currencyId, setCurrencyId] = useState(currencyIds[0]);
    const rows = brokerageWithTotalGroupedByCurrencyId[currencyId];

    const Footer = useGridFooter({
        rows,
        columns: [
            ValueColX,
            CostBasisCol,
            {
                ...RoiCol,
                colorize: true,
            },
            {
                ...RoiPercCol,
                colorize: true,
                renderFooter: () => {
                    const data = rows;
                    const costBasis = data.reduce((acc, row) => acc + row.costBasis, 0);
                    const total = data.reduce((acc, row) => acc + row.total, 0);

                    return (
                        <NumericValue
                            colorize={true}
                            variant="gridFooter"
                            value={financialNum(((total - costBasis) / costBasis) * 100)}
                            after="%"
                            before={`${RoiPercCol.headerName}: `}
                        />
                    );
                },
            },
        ],
    });

    return (
        <DashboardAccordion data-testid="brokerage" headerTitle="Investment Accounts" headerIcon={<IconStock />}>
            <DashboardGridWithSidebar
                sidebar={
                    <>
                        <CurrencyFilter ids={currencyIds} selected={currencyId} onChange={(id) => setCurrencyId(id)} />
                    </>
                }
            >
                <XGrid
                    sortModel={[{field: 'name', sort: 'asc'}]}
                    className={classes.table}
                    autoHeight={true}
                    rows={rows}
                    columns={[
                        NameColX,
                        ValueColX,
                        CostBasisCol,
                        RoiCol,
                        RoiPercCol,
                        makeAllocationCol(rows.reduce((acc, r) => acc.plus(r.total), new Decimal(0))),
                    ]}
                    components={{Footer}}
                />
            </DashboardGridWithSidebar>
        </DashboardAccordion>
    );
};
