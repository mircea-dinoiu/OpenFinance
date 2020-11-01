import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'components/BaseTable';
import {NumericValue} from 'components/formatters';
import {BalanceByLocationStock} from 'components/transactions/types';
import {firstColumnStyles, numericColumnStyles, ScreenQuery, spacingLarge, spacingNormal} from 'defs/styles';
import _ from 'lodash';
import React, {useState} from 'react';
import {Column} from 'react-table-6';
import {useAccounts} from 'state/accounts';
import {useScreenSize} from 'state/hooks';
import {useStocksMap} from 'state/stocks';
import {Stock} from 'types';
import {financialNum} from 'js/utils/numbers';

type StockWithUnits = Stock & {units: number; accounts: number; costBasis: number};

export const StocksTable = ({stockHoldings}: {stockHoldings: BalanceByLocationStock[]}) => {
    const [account, setAccount] = useState('');
    const accounts = useAccounts();
    const accountOptions = _.sortBy(
        _.uniqBy(stockHoldings, 'money_location_id')
            .filter((sh) => sh.stock_units !== 0)
            .map((sh) => ({
                value: String(sh.money_location_id),
                label: accounts.find((a) => a.id === sh.money_location_id)?.name ?? '',
            })),
        'label',
    );
    const cls = useStyles();
    const screenSize = useScreenSize();

    const filteredStockHoldings = stockHoldings.filter((sh) => !account || sh.money_location_id === Number(account));
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
        acc[sh.stock_id].units += sh.stock_units;
        acc[sh.stock_id].costBasis += sh.cost_basis;

        return acc;
    }, {});

    return (
        <div className={cls.root}>
            <RadioGroup value={account} onChange={(e) => setAccount(e.target.value)}>
                <FormControlLabel value="" control={<Radio />} label="All Accounts" />
                {accountOptions.map((o) => (
                    <FormControlLabel value={o.value} control={<Radio />} label={o.label} />
                ))}
            </RadioGroup>
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
                        columns={
                            screenSize.isSmall
                                ? [SymbolCol, TotalCol]
                                : [
                                      SymbolCol,
                                      UnitsCol,
                                      TotalCol,
                                      TotalCostCol,
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

const TotalCol: Column<StockWithUnits> = {
    Header: 'Value',
    id: 'value',
    accessor: (sh) => sh.units * sh.price,
    Cell: ({value, original}) => {
        return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
    },
    ...numericColumnStyles,
};
const makePercCol: (total: number) => Column<StockWithUnits> = _.memoize((total) => ({
    Header: '% of Portfolio',
    id: 'percPortfolio',
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

const TotalCostCol: Column<StockWithUnits> = {
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
