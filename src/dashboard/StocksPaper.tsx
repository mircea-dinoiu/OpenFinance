import {Card, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel, Paper} from '@material-ui/core';
import {TAccount} from 'accounts/defs';
import {useAccounts} from 'accounts/state';
import {DashboardGridWithSidebar} from 'dashboard/DashboardGridWithSidebar';
import {CurrencyFilter} from 'dashboard/filters/CurrencyFilter';
import {StocksTable} from 'dashboard/StocksTable';
import {groupBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import {BalanceByLocationStock} from 'transactions/defs';

export const StocksPaper = ({
    classes,
    accountOptions,
    stocks,
}: {
    classes: {paper: string; cardHeader: string};
    accountOptions: Array<
        TAccount & {
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
            <DashboardGridWithSidebar
                sidebar={
                    <>
                        <CurrencyFilter
                            ids={Object.keys(accountOptionsByCurrencyId)}
                            selected={currencyId}
                            onChange={(id) => setCurrencyId(id)}
                        />

                        <Card variant="outlined">
                            <CardContent>
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
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardContent>
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
                                                key={accountId}
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
                            </CardContent>
                        </Card>
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
