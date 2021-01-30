import {Checkbox, FormControlLabel, FormGroup, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'components/BaseTable';
import {NumericValue} from 'components/formatters';
import {BalanceByLocationStock} from 'components/transactions/types';
import {firstColumnStyles, numericColumnStyles, ScreenQuery, spacingLarge, spacingNormal} from 'defs/styles';
import {financialNum} from 'js/utils/numbers';
import {locales} from 'locales';
import _ from 'lodash';
import React, {useState} from 'react';
import {Column} from 'react-table-6';
import {useScreenSize} from 'state/hooks';
import {useStocksMap} from 'state/stocks';
import {Account, Stock} from 'types';

type StockWithUnits = Stock & {units: number; accounts: number; costBasis: number};

export const StocksTable = ({
    stockHoldings,
    accountOptions,
}: {
    stockHoldings: BalanceByLocationStock[];
    accountOptions: Array<Account & {label: string; value: string}>;
}) => {
    const [filteredAccounts, setFilteredAccounts] = useState<number[]>([]);
    const cls = useStyles();
    const screenSize = useScreenSize();
    const filteredStockHoldings = stockHoldings.filter(
        (sh) => filteredAccounts.length === 0 || filteredAccounts.includes(sh.money_location_id),
    );
    const stocksMap = useStocksMap();
    const stockHoldingsById: Record<string, StockWithUnits> = filteredStockHoldings.reduce((acc, sh) => {
        if (acc[sh.stock_id] === undefined) {
            acc[sh.stock_id] = {
                ...stocksMap.get(sh.stock_id),
                accounts: 0,
                units: 0,
                costBasis: 0,
            };
        }

        acc[sh.stock_id].accounts += 1;
        acc[sh.stock_id].units += sh.quantity;
        acc[sh.stock_id].costBasis += sh.cost_basis;

        return acc;
    }, {});
    const tableRows = Object.values(stockHoldingsById).filter((sh) => sh.units > 0);

    return (
        <div className={cls.root}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filteredAccounts.length === 0}
                            disabled={filteredAccounts.length === 0}
                            onChange={() => setFilteredAccounts([])}
                        />
                    }
                    label="All Accounts"
                />
                {accountOptions.map((o) => {
                    const accountId = Number(o.value);

                    return (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filteredAccounts.includes(accountId)}
                                    onChange={(e) => {
                                        setFilteredAccounts(
                                            e.target.checked
                                                ? filteredAccounts.concat(accountId)
                                                : filteredAccounts.filter(
                                                      (filteredAccountId) => filteredAccountId !== accountId,
                                                  ),
                                        );
                                    }}
                                />
                            }
                            label={o.label}
                        />
                    );
                })}
            </FormGroup>
            <div>
                {Object.entries(_.groupBy(tableRows, 'type')).map(([stockType, tableRowsOfType]) => (
                    <>
                        <Typography variant="h6">&nbsp;{locales.stockTypes[stockType]}</Typography>
                        <BaseTable
                            data={tableRowsOfType}
                            className={cls.table}
                            defaultSorted={[{id: 'value', desc: true}]}
                            columns={
                                screenSize.isSmall
                                    ? [SymbolCol, MarketValueCol]
                                    : [
                                          SymbolCol,
                                          UnitsCol,
                                          MarketPriceCol,
                                          MarketValueCol,
                                          CostBasisCol,
                                          CostPerShareCol,
                                          RoiCol,
                                          RoiPercCol,
                                          makePercCol(tableRows.reduce((acc, r) => acc + r.units * r.price, 0)),
                                      ]
                            }
                        />
                    </>
                ))}
            </div>
        </div>
    );
};

const SymbolCol: Column<StockWithUnits> = {
    Header: 'Symbol',
    accessor: 'symbol',
    ...firstColumnStyles,
};

const MarketValueCol: Column<StockWithUnits> = {
    Header: 'Market Value',
    id: 'value',
    accessor: (sh) => sh.units * sh.price,
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};
const makePercCol: (total: number) => Column<StockWithUnits> = _.memoize((total) => ({
    Header: 'Allocation',
    id: 'allocation',
    accessor: (sh) => ((sh.units * sh.price) / total) * 100,
    Cell: ({value}) => {
        return <NumericValue colorize={false} value={financialNum(value)} after="%" />;
    },
    ...numericColumnStyles,
}));

const CostPerShareCol: Column<StockWithUnits> = {
    Header: 'Cost Per Share',
    id: 'costPerShare',
    accessor: (sh) => sh.costBasis / sh.units,
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};

const CostBasisCol: Column<StockWithUnits> = {
    Header: 'Cost Basis',
    id: 'costTotal',
    accessor: (sh) => sh.costBasis,
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};

const RoiCol: Column<StockWithUnits> = {
    Header: 'Gain / Loss $',
    id: 'roi',
    accessor: (sh) => sh.price * sh.units - sh.costBasis,
    Cell: ({value, original}) => {
        return <NumericValue colorize={true} currency={original.currency_id} value={value} />;
    },
    ...numericColumnStyles,
};

const RoiPercCol: Column<StockWithUnits> = {
    Header: 'Gain / Loss %',
    id: 'roiPerc',
    accessor: (sh) => {
        const marketPrice = sh.price * sh.units;

        return financialNum(((marketPrice - sh.costBasis) / sh.costBasis) * 100);
    },
    Cell: ({value, original}) => <NumericValue colorize={true} value={value} after="%" />,
    ...numericColumnStyles,
};

const UnitsCol: Column<StockWithUnits> = {
    Header: 'Quantity',
    accessor: 'units',
    Cell: ({value, original}) => <NumericValue value={value} />,
    ...numericColumnStyles,
};

const MarketPriceCol: Column<StockWithUnits> = {
    Header: 'Market Price',
    accessor: 'price',
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: spacingNormal,
        [ScreenQuery.SMALL]: {
            gridTemplateColumns: '1fr',
        },
    },
    table: {
        '&:not(:last-child)': {
            marginBottom: spacingLarge,
        },
    },
});
