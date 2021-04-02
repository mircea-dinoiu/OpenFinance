import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControlLabel,
    Paper,
    Tab,
    Tabs,
    Theme,
    useMediaQuery,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {Alert, AlertTitle} from '@material-ui/lab';
import {BaseTable} from 'components/BaseTable';
import {BrokeragePaper} from 'domain/dashboard/BrokeragePaper';
import {CashFlow} from 'domain/dashboard/CashFlow';
import {CategoriesTab} from 'domain/dashboard/CategoriesTab';
import {NameCol, ValueCol} from 'domain/dashboard/columns';
import {
    CreditAprCol,
    CreditAvailableCol,
    CreditBalanceCol,
    CreditLimitCol,
    CreditUsageCol,
} from 'domain/dashboard/Credit';
import {getAccountOptions} from 'domain/dashboard/getAccountOptions';
import {NetWorthPapers} from 'domain/dashboard/NetWorthPapers';
import {PaymentPlanDialog} from 'domain/dashboard/PaymentPlanDialog';
import {PropertiesPaper} from 'domain/dashboard/PropertiesPaper';
import {StocksPaper} from 'domain/dashboard/StocksPaper';
import {useDashboardQueryParams} from 'domain/dashboard/useDashboardQueryParams';
import {UsersTab} from 'domain/dashboard/UsersTab';
import {getStockValue} from 'domain/dashboard/useStockValue';
import {NumericValue} from 'components/formatters';
import {IncludeDropdown} from 'components/include-dropdown/IncludeDropdown';
import {BigLoader} from 'components/loaders';
import {TabLink} from 'components/TabLink';
import {useInclude, useIncludePending} from 'components/transactions/helpers';
import {TransactionsEndDatePicker} from 'components/transactions/TransactionsEndDatePicker';
import {BalanceByLocation} from 'components/transactions/types';
import {Api} from 'app/Api';
import {Account, AccountType} from 'domain/accounts/defs';
import {paths} from 'js/defs';
import {locales} from 'locales';
import _, {groupBy} from 'lodash';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {generatePath, useParams} from 'react-router-dom';
import {useAccounts} from 'domain/accounts/state';
import {useRefreshWidgets} from 'app/state/hooks';
import {useSelectedProject} from 'app/state/projects';
import {useStockPrices} from 'domain/stocks/state';
import {summaryAssign, SummaryKey} from 'app/state/summary';
import {stickyHeaderHeight} from 'app/styles/stickyHeaderHeight';
import {createXHR} from 'app/utils/fetch';
import {makeUrl} from 'app/utils/url';

enum DashboardTab {
    banking = 'banking',
    cashFlow = 'cash-flow',
    investing = 'investing',
    properties = 'properties',
    userReports = 'user-reports',
    categoryReports = 'category-reports',
}

export const Dashboard = () => {
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

    const {tab = Object.values(DashboardTab)[0]} = useParams();
    const tabIndex = Object.values(DashboardTab).indexOf(tab as DashboardTab);

    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [paymentPlanDialogIsOpen, setPaymentPlanDialogIsOpen] = useState(false);

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

    const cashWithTotal = (accountsByType[AccountType.CASH] ?? [])
        .map((a) => ({
            ...a,
            total: getCostBasis(data.cash, a),
        }))
        .filter((a) => a.total !== 0);
    const cashTotals = getTotals(cashWithTotal);

    const creditWithTotal = (accountsByType[AccountType.CREDIT] ?? [])
        .map((a) => ({
            ...a,
            total: getCostBasis(data.cash, a),
        }))
        .filter((a) => a.total !== 0);
    const creditTotals = getTotals(creditWithTotal);

    const loanWithTotal = (accountsByType[AccountType.LOAN] ?? [])
        .map((a) => ({
            ...a,
            total: getCostBasis(data.cash, a),
        }))
        .filter((a) => a.total !== 0);

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
                <Paper className={cls.paper}>
                    <TransactionsEndDatePicker />

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
                    cashByCurrencyId={getTotals(cashWithTotal)}
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
                                to={generatePath(paths.dashboard, {
                                    id: selectedProject.id,
                                    tab,
                                })}
                            >
                                <Tab label={locales.dashboardTabs[index]} />
                            </TabLink>
                        ))}
                    </Tabs>
                </Paper>
                {tab === DashboardTab.cashFlow && <CashFlow />}
                {tab === DashboardTab.banking && (
                    <>
                        <>
                            {cashWithTotal.length > 0 && (
                                <Paper className={cls.paper}>
                                    <CardHeader
                                        className={cls.cardHeader}
                                        title={
                                            <>
                                                <IconCash /> Cash
                                            </>
                                        }
                                    />
                                    {Object.values(groupBy(cashWithTotal, 'currency_id')).map((data) => (
                                        <BaseTable
                                            defaultSorted={[{id: 'value', desc: true}]}
                                            className={cls.table}
                                            data={data}
                                            columns={[NameCol, ValueCol]}
                                        />
                                    ))}
                                </Paper>
                            )}

                            {creditWithTotal.concat(loanWithTotal).length > 0 && (
                                <Paper className={cls.paper}>
                                    {paymentPlanDialogIsOpen && (
                                        <PaymentPlanDialog
                                            open={true}
                                            creditWithTotal={creditWithTotal.concat(loanWithTotal)}
                                            onClose={() => setPaymentPlanDialogIsOpen(false)}
                                        />
                                    )}
                                    {[
                                        {
                                            items: loanWithTotal,
                                            title: 'Loans',
                                            Icon: IconLoan,
                                        },
                                        {items: creditWithTotal, title: 'Credit Cards', Icon: IconCredit},
                                    ].map((group) =>
                                        Object.values(groupBy(group.items, 'currency_id')).map((data) => (
                                            <>
                                                <CardHeader
                                                    className={cls.cardHeader}
                                                    title={
                                                        <>
                                                            {React.createElement(group.Icon)}
                                                            <span>{group.title}</span>
                                                        </>
                                                    }
                                                />
                                                <BaseTable
                                                    defaultSorted={[{id: 'name', desc: false}]}
                                                    className={cls.table}
                                                    data={data}
                                                    columns={
                                                        isSmall
                                                            ? [NameCol, CreditBalanceCol, CreditUsageCol]
                                                            : [
                                                                  NameCol,
                                                                  CreditBalanceCol,
                                                                  CreditAvailableCol,
                                                                  CreditLimitCol,
                                                                  CreditUsageCol,
                                                                  CreditAprCol,
                                                              ]
                                                    }
                                                />
                                            </>
                                        )),
                                    )}
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => setPaymentPlanDialogIsOpen(true)}
                                    >
                                        Payment Plan for Loans and Credit Cards
                                    </Button>
                                </Paper>
                            )}
                        </>
                    </>
                )}

                {tab === DashboardTab.investing && (
                    <>
                        {brokerageWithTotal.length > 0 ? (
                            <>
                                <BrokeragePaper classes={cls} brokerageWithTotal={brokerageWithTotal} />

                                <StocksPaper classes={cls} accountOptions={accountOptions} stocks={data.stocks} />
                            </>
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

const getCostBasis = (cash: BalanceByLocation['cash'], account: Account) => {
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
