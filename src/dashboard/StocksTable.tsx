import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {NumericValue} from 'app/formatters';
import {locales} from 'app/locales';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import _ from 'lodash';
import React from 'react';
import {TStock} from 'stocks/defs';
import {useStocksMap} from 'stocks/state';
import {BalanceByLocationStock} from 'transactions/defs';
import {createNumericColumnX} from 'app/createNumericColumn';
import {XGrid, GridColDef} from '@material-ui/x-grid';

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
                        <Typography variant="h6" paragraph={true}>
                            &nbsp;{locales.stockTypes[stockType]}
                        </Typography>
                        <XGrid
                            autoHeight={true}
                            className={cls.table}
                            rows={tableRowsOfType}
                            sortModel={[{field: 'symbol', sort: 'asc'}]}
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
                            getRowClassName={(params) => {
                                const {units} = params.row as StockWithUnits;

                                return units.isZero() ? 'opacityHalf' : '';
                            }}
                            hideFooter={true}
                        />
                    </>
                ))}
            </div>
        </>
    );
};

const SymbolCol: GridColDef = {
    headerName: 'Symbol',
    field: 'symbol',
    flex: 1,
};

const renderAmountCell: GridColDef['renderCell'] = ({value, row}) => {
    const original = row as StockWithUnits;

    return original.units.isZero() ? (
        <>{locales.mdash}</>
    ) : (
        <NumericValue currency={original.currency_id} value={value as number} variant="gridCell" />
    );
};

const ValueCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Value',
    field: 'value',
    valueGetter: (params) => {
        const sh = params.row as StockWithUnits;

        return sh.units.mul(sh.price).toNumber();
    },
    renderCell: renderAmountCell,
});
const makePercCol: (total: number) => GridColDef = _.memoize((total) =>
    createNumericColumnX<StockWithUnits>({
        headerName: 'Allocation',
        field: 'allocation',
        valueGetter: (params) => {
            const sh = params.row as StockWithUnits;

            return sh.units
                .mul(sh.price)
                .div(total)
                .mul(100)
                .toNumber();
        },
        renderCell: ({value, row}) => {
            const original = row as StockWithUnits;

            return original.units.isZero() ? (
                <>{locales.mdash}</>
            ) : (
                <NumericValue variant="gridCell" value={financialNum(value as number)} after="%" />
            );
        },
    }),
);

const CostPerShareCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Cost Per Share',
    field: 'costPerShare',
    valueGetter: (params) => {
        const sh = params.row as StockWithUnits;

        return sh.costBasis.div(sh.units).toNumber();
    },
    renderCell: renderAmountCell,
});

const CostBasisCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Cost Basis',
    field: 'costBasis',
    renderCell: renderAmountCell,
});

const RoiCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Gain / Loss $',
    field: 'roi',
    valueGetter: ({row}) => {
        const sh = row as StockWithUnits;

        return sh.units
            .times(sh.price)
            .minus(sh.costBasis)
            .toNumber();
    },
});

const RoiPercCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Gain / Loss %',
    field: 'roiPerc',
    valueGetter: ({row}) => {
        const sh = row as StockWithUnits;
        const value = sh.units.mul(sh.price);

        return financialNum(
            value
                .minus(sh.costBasis)
                .div(sh.costBasis)
                .times(100)
                .toNumber(),
        );
    },
    renderCell: ({value, row}) => {
        const original = row as StockWithUnits;

        return original.units.isZero() ? (
            <>{locales.mdash}</>
        ) : (
            <NumericValue variant="gridCell" colorize={true} value={value as number} after="%" />
        );
    },
});

const StocksQuantityCol = createNumericColumnX<StockWithUnits>({
    headerName: 'Quantity',
    field: 'units',
    renderCell: ({row: original, value}) =>
        original.units.isZero() ? (
            <>{locales.mdash}</>
        ) : (
            <NumericValue value={(value as Decimal).toNumber()} variant="gridCell" />
        ),
});

const MarketPriceCol = createNumericColumnX<StockWithUnits>(
    {
        headerName: 'Market Price',
        field: 'price',
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
