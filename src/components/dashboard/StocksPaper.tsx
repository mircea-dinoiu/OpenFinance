import React, {useState, useEffect} from 'react';
import {Account} from 'types';
import {
    Paper,
    CardHeader,
    FormControlLabel,
    Checkbox,
    Divider,
    FormLabel,
    FormControl,
    RadioGroup,
    Radio,
} from '@material-ui/core';
import IconStock from '@material-ui/icons/TrendingUp';
import {StocksTable} from 'components/dashboard/StocksTable';
import {groupBy} from 'lodash';
import {useCurrenciesMap} from 'state/currencies';
import {useAccounts} from 'state/accounts';
import {BalanceByLocationStock} from 'components/transactions/types';
import {makeStyles} from '@material-ui/core/styles';
import {spacingNormal, ScreenQuery} from 'defs/styles';

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
    const cls = useStyles();
    const currenciesMap = useCurrenciesMap();
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
            <div className={cls.root}>
                <div>
                    <FormControl>
                        <FormLabel>Currency</FormLabel>
                        <RadioGroup value={currencyId.toString()} onChange={(e) => setCurrencyId(e.target.value)}>
                            {Object.keys(accountOptionsByCurrencyId).map((currencyId) => (
                                <FormControlLabel
                                    value={currencyId}
                                    control={<Radio />}
                                    label={currenciesMap[currencyId].iso_code}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

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
                    </FormControl>
                </div>
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
            </div>
        </Paper>
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
