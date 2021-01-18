import {Checkbox, FormControlLabel, FormGroup} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'components/BaseTable';
import {NumericValue} from 'components/formatters';
import {BalanceByLocationStock} from 'components/transactions/types';
import {firstColumnStyles, numericColumnStyles, ScreenQuery, spacingLarge, spacingNormal} from 'defs/styles';
import {financialNum} from 'js/utils/numbers';
import _ from 'lodash';
import React, {useState} from 'react';
import {Column} from 'react-table-6';
import {useAccounts} from 'state/accounts';
import {useScreenSize} from 'state/hooks';
import {useStocksMap} from 'state/stocks';
import {Stock} from 'types';

type StockWithUnits = Stock & {units: number; accounts: number; costBasis: number};

export const StocksTable = ({stockHoldings}: {stockHoldings: BalanceByLocationStock[]}) => {
    const [filteredAccounts, setFilteredAccounts] = useState<number[]>([]);
    const accounts = useAccounts();
    const accountOptions = _.uniqBy(
        _.sortBy(
            stockHoldings
                .filter((sh) => sh.quantity !== 0)
                .map((sh) => ({
                    value: String(sh.money_location_id),
                    label: accounts.find((a) => a.id === sh.money_location_id)?.name ?? '',
                })),
            'label',
        ),
        'value',
    );

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
                {Object.values(
                    _.groupBy(
                        Object.values(stockHoldingsById).filter((sh) => sh.units > 0),
                        'currency_id',
                    ),
                ).map((data) => (
                    <BaseTable
                        data={data}
                        className={cls.table}
                        defaultSorted={[{id: 'value', desc: true}]}
                        columns={
                            screenSize.isSmall
                                ? [SymbolCol, ValueCol]
                                : [
                                      SymbolCol,
                                      UnitsCol,
                                      ValueCol,
                                      CostCol,
                                      makePercCol(data.reduce((acc, r) => acc + r.units * r.price, 0)),
                                      CostPerShareCol,
                                      MarketPrice,
                                      RoiCol,
                                      RoiPercCol,
                                  ]
                        }
                    />
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

const ValueCol: Column<StockWithUnits> = {
    Header: 'Value',
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

const CostCol: Column<StockWithUnits> = {
    Header: 'Total Cost',
    id: 'costTotal',
    accessor: (sh) => sh.costBasis,
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};

const RoiCol: Column<StockWithUnits> = {
    Header: 'ROI',
    id: 'roi',
    accessor: (sh) => sh.price * sh.units - sh.costBasis,
    Cell: ({value, original}) => {
        return <NumericValue colorize={true} currency={original.currency_id} value={value} />;
    },
    ...numericColumnStyles,
};

const RoiPercCol: Column<StockWithUnits> = {
    Header: 'ROI%',
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

const MarketPrice: Column<StockWithUnits> = {
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
