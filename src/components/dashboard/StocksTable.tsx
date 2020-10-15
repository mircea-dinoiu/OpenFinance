import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {BaseTable} from 'components/BaseTable';
import {NumericValue} from 'components/formatters';
import {BalanceByLocationStock} from 'components/transactions/types';
import {lastColumnStyles, ScreenQuery, spacingNormal} from 'defs/styles';
import _ from 'lodash';
import React, {useState} from 'react';
import {useAccounts} from 'state/accounts';
import {useStocksMap} from 'state/stocks';
import {Stock} from 'types';

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
            <BaseTable
                data={Object.values(stockHoldingsById).filter((sh) => sh.units > 0)}
                columns={[
                    {
                        Header: 'Symbol',
                        accessor: 'symbol',
                        headerStyle: {
                            textAlign: 'center',
                        },
                    },
                    {
                        Header: 'Units',
                        accessor: 'units',
                        style: {
                            textAlign: 'center',
                        },
                    },

                    {
                        Header: 'Market Price',
                        accessor: 'price',
                        Cell: ({value, original}) => {
                            return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
                        },
                        style: {
                            textAlign: 'center',
                        },
                    },
                    {
                        Header: 'Value',
                        id: 'value',
                        accessor: (sh) => sh.units * sh.price,
                        Cell: ({value, original}) => {
                            return <NumericValue currency={original.currency_id} value={value} colorize={false} />;
                        },
                        ...lastColumnStyles,
                    },
                ]}
            />
        </div>
    );
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
