import {CardHeader, Paper, Theme, useMediaQuery} from '@material-ui/core';
import IconStock from '@material-ui/icons/TrendingUp';
import {BaseTable} from 'components/BaseTable';
import {CostBasisCol, NameCol, RoiCol, RoiPercCol, ValueCol} from 'dashboard/columns';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {BrokerageAccount} from 'dashboard/defs';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import {groupBy} from 'lodash';
import React, {useState} from 'react';

export const BrokeragePaper = ({
    classes,
    brokerageWithTotal,
}: {
    brokerageWithTotal: BrokerageAccount[];
    classes: {
        paper: string;
        cardHeader: string;
        table: string;
    };
}) => {
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const brokerageWithTotalGroupedByCurrencyId = groupBy(brokerageWithTotal, 'currency_id');
    const currencyIds = Object.keys(brokerageWithTotalGroupedByCurrencyId);
    const [currencyId, setCurrencyId] = useState(currencyIds[0]);

    return (
        <Paper className={classes.paper}>
            <CardHeader
                className={classes.cardHeader}
                title={
                    <>
                        <IconStock /> Investment Accounts
                    </>
                }
            />
            <DashboardGridWithSidebar
                sidebar={
                    <>
                        <CurrencyFilter ids={currencyIds} selected={currencyId} onChange={(id) => setCurrencyId(id)} />
                    </>
                }
            >
                <BaseTable<BrokerageAccount>
                    defaultSorted={[{id: 'name', desc: false}]}
                    className={classes.table}
                    data={brokerageWithTotalGroupedByCurrencyId[currencyId]}
                    columns={isSmall ? [NameCol, ValueCol] : [NameCol, ValueCol, CostBasisCol, RoiCol, RoiPercCol]}
                />
            </DashboardGridWithSidebar>
        </Paper>
    );
};
