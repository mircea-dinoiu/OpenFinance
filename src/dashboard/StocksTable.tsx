import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'app/BaseTable';
import {NumericValue} from 'app/formatters';
import {locales} from 'app/locales';
import {firstColumnStyles} from 'app/styles/column';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import _ from 'lodash';
import React from 'react';
import {Column} from 'react-table-6';
import {TStock} from 'stocks/defs';
import {useStocksMap} from 'stocks/state';
import {BalanceByLocationStock} from 'transactions/defs';
import {createNumericColumn} from 'app/createNumericColumn';

type StockWithUnits = TStock & {units: Decimal; accounts: number; costBasis: Decimal};

export const StocksTable = ({
    stockHoldings,
    soldStocksAreVisible,
    filteredAccounts,
}: {
    stockHoldings: BalanceByLocationStock[];
    soldStocksAreVisible: boolean;
    filteredAccounts: number[];
}) => {
    const cls = useStyles();
    const filteredStockHoldings = stockHoldings.filter(
        (sh) => filteredAccounts.length === 0 || filteredAccounts.includes(sh.money_location_id),
    );
    const stocksMap = useStocksMap();
    const stockHoldingsById: Record<string, StockWithUnits> = filteredStockHoldings.reduce((acc, sh) => {
        if (acc[sh.stock_id] === undefined) {
            acc[sh.stock_id] = {
                ...stocksMap.get(sh.stock_id),
                accounts: 0,
                units: new Decimal(0),
                costBasis: new Decimal(0),
            };
        }

        acc[sh.stock_id].accounts += 1;
        acc[sh.stock_id].units = acc[sh.stock_id].units.plus(sh.quantity);
        acc[sh.stock_id].costBasis = acc[sh.stock_id].costBasis.plus(sh.cost_basis);

        return acc;
    }, {});
    const tableRows = Object.values(stockHoldingsById).filter(
        (sh) => (sh.units.toNumber() !== 0 || soldStocksAreVisible) && sh.costBasis.toNumber() !== 0,
    );

    return (
        <>
            <div>
                {Object.entries(_.groupBy(tableRows, 'type')).map(([stockType, tableRowsOfType]) => (
                    <>
                        <Typography variant="h6">&nbsp;{locales.stockTypes[stockType]}</Typography>
                        <BaseTable
                            data={tableRowsOfType}
                            className={cls.table}
                            defaultSorted={[{id: 'symbol', desc: false}]}
                            columns={[
                                SymbolCol,
                                StocksQuantityCol,
                                MarketPriceCol,
                                ValueCol,
                                CostBasisCol,
                                CostPerShareCol,
                                RoiCol,
                                RoiPercCol,
                                makePercCol(
                                    tableRows
                                        .reduce((acc, r) => acc.plus(r.units.mul(r.price)), new Decimal(0))
                                        .toNumber(),
                                ),
                            ]}
                            getTrProps={(finalState: any, rowInfo: any) => {
                                return {
                                    style: {
                                        opacity: rowInfo.original.units.isZero() ? 0.5 : 1,
                                    },
                                };
                            }}
                        />
                    </>
                ))}
            </div>
        </>
    );
};

const SymbolCol: Column<StockWithUnits> = {
    Header: 'Symbol',
    accessor: 'symbol',
    ...firstColumnStyles,
};

const ValueCol = createNumericColumn<StockWithUnits>({
    Header: 'Value',
    id: 'value',
    accessor: (sh) => sh.units.mul(sh.price).toNumber(),
    Cell: ({value, original}) => {
        return original.units.isZero() ? (
            locales.mdash
        ) : (
            <NumericValue currency={original.currency_id} value={value} variant="tableCell" />
        );
    },
});
const makePercCol: (total: number) => Column<StockWithUnits> = _.memoize((total) =>
    createNumericColumn({
        Header: 'Allocation',
        id: 'allocation',
        accessor: (sh) =>
            sh.units
                .mul(sh.price)
                .div(total)
                .mul(100)
                .toNumber(),
        Cell: ({value, original}) => {
            return original.units.isZero() ? (
                locales.mdash
            ) : (
                <NumericValue variant="tableCell" value={financialNum(value)} after="%" />
            );
        },
    }),
);

const CostPerShareCol = createNumericColumn<StockWithUnits>({
    Header: 'Cost Per Share',
    id: 'costPerShare',
    accessor: (sh) => sh.costBasis.div(sh.units).toNumber(),
    Cell: ({value, original}) => {
        return original.units.isZero() ? (
            locales.mdash
        ) : (
            <NumericValue currency={original.currency_id} value={value} variant="tableCell" />
        );
    },
});

const CostBasisCol = createNumericColumn<StockWithUnits>({
    Header: 'Cost Basis',
    id: 'costTotal',
    accessor: (sh) => sh.costBasis,
    Cell: ({value, original}) => {
        return original.units.isZero() ? (
            locales.mdash
        ) : (
            <NumericValue currency={original.currency_id} value={value} variant="tableCell" />
        );
    },
});

const RoiCol = createNumericColumn<StockWithUnits>({
    Header: 'Gain / Loss $',
    id: 'roi',
    accessor: (sh) =>
        sh.units
            .times(sh.price)
            .minus(sh.costBasis)
            .toNumber(),
});

const RoiPercCol = createNumericColumn<StockWithUnits>({
    Header: 'Gain / Loss %',
    id: 'roiPerc',
    accessor: (sh) => {
        const value = sh.units.mul(sh.price);

        return financialNum(
            value
                .minus(sh.costBasis)
                .div(sh.costBasis)
                .times(100)
                .toNumber(),
        );
    },
    Cell: ({value, original}) =>
        original.units.isZero() ? (
            locales.mdash
        ) : (
            <NumericValue variant="tableCell" colorize={true} value={value} after="%" />
        ),
});

const StocksQuantityCol = createNumericColumn<StockWithUnits>({
    Header: 'Quantity',
    accessor: 'units',
    Cell: ({value, original}) =>
        original.units.isZero() ? locales.mdash : <NumericValue value={value.toNumber()} variant="tableCell" />,
});

const MarketPriceCol = createNumericColumn<StockWithUnits>(
    {
        Header: 'Market Price',
        accessor: 'price',
    },
    {
        colorize: false,
    },
);

const useStyles = makeStyles((theme) => ({
    table: {
        '&:not(:last-child)': {
            marginBottom: theme.spacing(2),
        },
    },
}));
