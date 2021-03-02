import {CardHeader, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, Paper} from '@material-ui/core';
import IconStock from '@material-ui/icons/TrendingUp';
import {DashboardGridWithSidebar} from 'components/dashboard/DashboardGridWithSidebar';
import {CurrencyFilter} from 'components/dashboard/filters/CurrencyFilter';
import {StocksTable} from 'components/dashboard/StocksTable';
import {BalanceByLocationStock} from 'components/transactions/types';
import {groupBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useAccounts} from 'state/accounts';
import {Account} from 'types';

export const StocksPaper = ({
    classes,
    accountOptions,
    stocks,
}: {
    classes: {paper: string; cardHeader: string};
    accountOptions: Array<
        Account & {
            value: string;
            label: string;
        }
    >;
    stocks: BalanceByLocationStock[];
}) => {
    const accountOptionsByCurrencyId = groupBy(accountOptions, 'currency_id');
    const [currencyId, setCurrencyId] = useState(Object.keys(accountOptionsByCurrencyId)[0]);
    const accounts = useAccounts();
    const [soldStocksAreVisible, setSoldStocksAreVisible] = useState(false);
    const accountOptionsOfCurrency = accountOptionsByCurrencyId[currencyId];
    const [filteredAccounts, setFilteredAccounts] = useState<number[]>([]);

    useEffect(() => {
        setFilteredAccounts([]);
    }, [currencyId]);

    return (
        <Paper className={classes.paper}>
            <CardHeader
                className={classes.cardHeader}
                title={
                    <>
                        <IconStock /> Stocks
                    </>
                }
            />
            <DashboardGridWithSidebar
                sidebar={
                    <>
                        <CurrencyFilter
                            ids={Object.keys(accountOptionsByCurrencyId)}
                            selected={currencyId}
                            onChange={(id) => setCurrencyId(id)}
                        />

                        <Divider />
                        <br />

                        <FormControl>
                            <FormLabel>Sold Investments</FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={soldStocksAreVisible}
                                        onChange={(e) => setSoldStocksAreVisible(e.target.checked)}
                                    />
                                }
                                label="Display"
                            />
                        </FormControl>

                        <Divider />
                        <br />

                        <FormControl>
                            <FormLabel>Account</FormLabel>
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
                            {accountOptionsOfCurrency.map((o) => {
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
                                                                  (filteredAccountId) =>
                                                                      filteredAccountId !== accountId,
                                                              ),
                                                    );
                                                }}
                                            />
                                        }
                                        label={o.label}
                                    />
                                );
                            })}
                        </FormControl>
                    </>
                }
            >
                <StocksTable
                    filteredAccounts={filteredAccounts}
                    stockHoldings={stocks.filter((s) => {
                        return (
                            accounts.find((a) => {
                                return a.id === s.money_location_id;
                            })?.currency_id === Number(currencyId)
                        );
                    })}
                    soldStocksAreVisible={soldStocksAreVisible}
                />
            </DashboardGridWithSidebar>
        </Paper>
    );
};
