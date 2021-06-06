import {Card, CardContent, Checkbox, FormControlLabel, Paper, Tab, Tabs} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Alert, AlertTitle} from '@material-ui/lab';
import {TAccount, AccountType, AccountStatus} from 'accounts/defs';
import {useAccounts} from 'accounts/state';
import {Api} from 'app/Api';
import {createXHR} from 'app/fetch';
import {NumericValue} from 'app/formatters';
import {BigLoader} from 'app/loaders';
import {locales} from 'app/locales';
import {stickyHeaderHeight} from 'app/styles/stickyHeaderHeight';
import {TabLink} from 'app/TabLink';
import {makeUrl} from 'app/url';
import {Banking} from 'dashboard/banking/Banking';
import {CashFlow} from 'dashboard/cashFlow/CashFlow';
import {CategoriesTab} from 'dashboard/CategoriesTab';
import {getAccountOptions} from 'dashboard/getAccountOptions';
import {NetWorthPapers} from 'dashboard/NetWorthPapers';
import {PropertiesPaper} from 'dashboard/PropertiesPaper';
import {StocksPaper} from 'dashboard/StocksPaper';
import {useDashboardQueryParams} from 'dashboard/useDashboardQueryParams';
import {UsersTab} from 'dashboard/UsersTab';
import {getStockValue} from 'dashboard/useStockValue';
import {useInclude, useIncludePending} from 'include/helpers';
import {IncludeDropdown} from 'include/IncludeDropdown';
import {paths} from 'app/paths';
import _ from 'lodash';
import {useSelectedProject} from 'projects/state';
import React from 'react';
import {useDispatch} from 'react-redux';
import {generatePath, useParams, useLocation} from 'react-router-dom';
import {useRefreshWidgets} from 'refreshWidgets/state';
import {useStockPrices} from 'stocks/state';
import {summaryAssign, SummaryKey} from 'summary/state';
import {BalanceByLocation} from 'transactions/defs';

enum DashboardTab {
    accounts = 'accounts',
    cashFlow = 'cash-flow',
    investing = 'investing',
    properties = 'properties',
    userReports = 'user-reports',
    categoryReports = 'category-reports',
}

export const Dashboard = () => {
    const location = useLocation();
    const cls = useStyles();
    const accounts = useAccounts();
    const accountsByType = _.groupBy(accounts, 'type');
    const [data, setData] = React.useState<BalanceByLocation | null>(null);
    const refreshWidgets = useRefreshWidgets();
    const dispatch = useDispatch();
    const [includePending, setIncludePending] = useIncludePending();
    const [include, setInclude] = useInclude();
    const reportQueryParams = useDashboardQueryParams();
    const selectedProject = useSelectedProject();
    const url = makeUrl(Api.reports.balanceByLocation, reportQueryParams);
    const stockPrices = useStockPrices();

    const {tab = Object.values(DashboardTab)[0]} = useParams<{tab: DashboardTab}>();
    const tabIndex = Object.values(DashboardTab).indexOf(tab as DashboardTab);

    React.useEffect(() => {
        createXHR<BalanceByLocation>({
            url,
        }).then((response) => {
            dispatch(summaryAssign(SummaryKey.BALANCE_BY_ACCOUNT, response.data as any));
            setData(response.data);
        });
    }, [dispatch, refreshWidgets, url]);

    if (!data) {
        return <BigLoader />;
    }

    const handleToggleIncludePending = () => {
        setIncludePending(!includePending);
    };
    const getLiquidAccountsOfType = (type: AccountType) => {
        return (accountsByType[type] ?? [])
            .map((a) => ({
                ...a,
                total: getCostBasis(data.cash, a),
            }))
            .filter((a) => a.total !== 0 || a.status !== AccountStatus.CLOSED);
    };
    const getAccountsWithTotal = (
        type: AccountType,
    ): [ReturnType<typeof getLiquidAccountsOfType>, ReturnType<typeof getTotals>] => {
        const accountsOfType = getLiquidAccountsOfType(type);
        const totals = getTotals(accountsOfType);

        return [accountsOfType, totals];
    };

    const [cashWithTotal, cashTotals] = getAccountsWithTotal(AccountType.CASH);
    const [checkingWithTotal] = getAccountsWithTotal(AccountType.CHECKING);
    const [savingsWithTotal] = getAccountsWithTotal(AccountType.SAVINGS);
    const liquidWithTotal = [...cashWithTotal, ...checkingWithTotal, ...savingsWithTotal];

    const [creditWithTotal, creditTotals] = getAccountsWithTotal(AccountType.CREDIT);
    const [loanWithTotal] = getAccountsWithTotal(AccountType.LOAN);

    const brokerageWithTotal = (accountsByType[AccountType.BROKERAGE] ?? [])
        .map((a) => {
            const stocks = data.stocks.filter((ds) => ds.money_location_id === a.id);

            return {
                ...a,
                costBasis: getCostBasis(data.cash, a),
                total: getStockValue(stocks, stockPrices),
                stocks,
            };
        })
        .filter((a) => a.total !== 0);
    const accountOptions = getAccountOptions({stocks: data.stocks, accounts});

    return (
        <div className={cls.root}>
            <div>
                <Paper className={cls.paper + ' ' + cls.topWidget}>
                    <IncludeDropdown
                        value={include}
                        onChange={(value) => {
                            setInclude(value);
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={includePending} onChange={handleToggleIncludePending} color="default" />
                        }
                        label="Include pending transactions"
                    />
                </Paper>

                <NetWorthPapers
                    className={cls.paper}
                    inventoriesByCurrencyId={_.groupBy(data.inventories, 'currency_id')}
                    liquidByCurrencyId={getTotals(liquidWithTotal)}
                    investmentsByCurrencyId={getTotals(brokerageWithTotal)}
                    debtByCurrencyId={getTotals([...creditWithTotal, ...loanWithTotal])}
                />

                {Object.entries(creditTotals).map(([currencyId, total]) => {
                    const sum = cashTotals[currencyId] + total;

                    return sum < 0 ? (
                        <Paper>
                            <Alert severity="warning" variant="outlined">
                                <AlertTitle>Overdraft</AlertTitle>
                                <span>
                                    You have an overdraft of{' '}
                                    <NumericValue
                                        colorize={false}
                                        currency={Number(currencyId)}
                                        value={Math.abs(sum)}
                                    />
                                </span>
                            </Alert>
                        </Paper>
                    ) : null;
                })}
            </div>
            <div>
                <Paper className={cls.tabsPaper} elevation={5}>
                    <Tabs value={tabIndex} variant="scrollable" scrollButtons="on">
                        {Object.values(DashboardTab).map((tab, index) => (
                            <TabLink
                                key={tab}
                                to={{
                                    ...location,
                                    pathname: generatePath(paths.dashboard, {
                                        id: selectedProject.id,
                                        tab,
                                    }),
                                }}
                            >
                                <Tab label={locales.dashboardTabs[index]} />
                            </TabLink>
                        ))}
                    </Tabs>
                </Paper>
                {tab === DashboardTab.cashFlow && <CashFlow />}
                {tab === DashboardTab.accounts && (
                    <Banking
                        classes={cls}
                        liquidWithTotal={liquidWithTotal}
                        creditWithTotal={creditWithTotal}
                        loanWithTotal={loanWithTotal}
                        brokerageWithTotal={brokerageWithTotal}
                    />
                )}

                {tab === DashboardTab.investing && (
                    <>
                        {brokerageWithTotal.length > 0 ? (
                            <StocksPaper classes={cls} accountOptions={accountOptions} stocks={data.stocks} />
                        ) : (
                            <Card>
                                <CardContent>{locales.nothingToSeeHereYet}</CardContent>
                            </Card>
                        )}
                    </>
                )}

                {tab === DashboardTab.properties && <PropertiesPaper classes={cls} />}

                {tab === DashboardTab.userReports && (
                    <Paper className={cls.paper}>
                        <UsersTab reportQueryParams={reportQueryParams} />
                    </Paper>
                )}
                {tab === DashboardTab.categoryReports && (
                    <Paper className={cls.paper}>
                        <CategoriesTab reportQueryParams={reportQueryParams} />
                    </Paper>
                )}
            </div>
        </div>
    );
};

const getTotals = (
    accounts: Array<{
        currency_id: number;
        total: number;
    }>,
): Record<string, number> => {
    const totals = {};

    for (const [currencyId, accs] of Object.entries(_.groupBy(accounts, 'currency_id'))) {
        totals[currencyId] = accs.reduce((acc, c) => acc + c.total, 0);
    }

    return totals;
};

const getCostBasis = (cash: BalanceByLocation['cash'], account: TAccount) => {
    return cash.find((c) => c.money_location_id === account.id)?.sum ?? 0;
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: theme.spacing(1),

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },
    },
    tabsPaper: {
        maxWidth: '100vw',
        position: 'sticky',
        top: stickyHeaderHeight,
        marginBottom: theme.spacing(1),
        zIndex: 1,
    },
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
        maxWidth: '100vw',
    },
    topWidget: {
        display: 'flex',
        flexDirection: 'column',
        gridGap: theme.spacing(1),
    },
    cardHeader: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        '& .MuiCardHeader-title': {
            display: 'grid',
            alignItems: 'center',
            gridGap: theme.spacing(1),
            gridTemplateColumns: 'auto 1fr',
        },
    },
    cashCreditGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: theme.spacing(1),

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },
    },
    table: {
        '&:not(:last-child)': {
            marginBottom: theme.spacing(2),
        },
    },
}));
