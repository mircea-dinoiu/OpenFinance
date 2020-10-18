import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'components/BaseTable';
import {NumericValue} from 'components/formatters';
import {BalanceByLocationStock} from 'components/transactions/types';
import {firstColumnStyles, numericColumnStyles, ScreenQuery, spacingNormal} from 'defs/styles';
import _ from 'lodash';
import React, {useState} from 'react';
import {Column} from 'react-table-6';
import {useAccounts} from 'state/accounts';
import {useScreenSize} from 'state/hooks';
import {useStocksMap} from 'state/stocks';
import {Stock} from 'types';

type StockWithUnits = Stock & {units: number};

export const StocksTable = ({stockHoldings}: {stockHoldings: BalanceByLocationStock[]}) => {
    const [account, setAccount] = useState('');
    const accounts = useAccounts();
    const accountOptions = _.sortBy(
        _.uniqBy(stockHoldings, 'money_location_id').map((sh) => ({
            value: String(sh.money_location_id),
            label: accounts.find((a) => a.id === sh.money_location_id)?.name ?? '',
        })),
        'label',
    );
    const cls = useStyles();
    const screenSize = useScreenSize();

    const filteredStockHoldings = stockHoldings.filter((sh) => !account || sh.money_location_id === Number(account));
    const stocksMap = useStocksMap();
    const stockHoldingsById: Record<string, Stock & {units: number}> = filteredStockHoldings.reduce((acc, sh) => {
        if (acc[sh.stock_id] === undefined) {
            acc[sh.stock_id] = {
                ...stocksMap.get(sh.stock_id),
                units: 0,
            };
        }

        acc[sh.stock_id].units += sh.stock_units;

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
                <BaseTable
                    data={Object.values(stockHoldingsById).filter((sh) => sh.units > 0)}
                    columns={screenSize.isSmall ? [SymbolCol, TotalCol] : [SymbolCol, TotalCol, UnitsCol, PriceCol]}
                />
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

const UnitsCol: Column<StockWithUnits> = {
    Header: 'Units',
    accessor: 'units',
    ...numericColumnStyles,
};

const PriceCol: Column<StockWithUnits> = {
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
});
