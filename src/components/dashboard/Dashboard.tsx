import {Button, CardHeader, Checkbox, Divider, FormControlLabel, Paper, Tab, Tabs} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {Alert, AlertTitle} from '@material-ui/lab';
import {BaseTable} from 'components/BaseTable';
import {BrokeragePaper} from 'components/dashboard/BrokeragePaper';
import {CategoriesTab} from 'components/dashboard/CategoriesTab';
import {NameCol, ValueCol} from 'components/dashboard/columns';
import {CreditAprCol, CreditBalanceCol, CreditLimitCol, CreditUsageCol} from 'components/dashboard/Credit';
import {CashAccount} from 'components/dashboard/defs';
import {getAccountOptions} from 'components/dashboard/getAccountOptions';
import {PaymentPlanDialog} from 'components/dashboard/PaymentPlanDialog';
import {StocksPaper} from 'components/dashboard/StocksPaper';
import {useDashboardQueryParams} from 'components/dashboard/useDashboardQueryParams';
import {UsersTab} from 'components/dashboard/UsersTab';
import {getStockValue} from 'components/dashboard/useStockValue';
import {NumericValue} from 'components/formatters';
import {IncludeDropdown} from 'components/include-dropdown/IncludeDropdown';
import {BigLoader} from 'components/loaders';
import {useInclude, useIncludePending} from 'components/transactions/helpers';
import {TransactionsEndDatePicker} from 'components/transactions/TransactionsEndDatePicker';
import {BalanceByLocation} from 'components/transactions/types';
import {routes} from 'defs/routes';
import {ScreenQuery, spacingLarge, spacingNormal, spacingSmall} from 'defs/styles';
import _, {groupBy} from 'lodash';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AccountType, useAccounts} from 'state/accounts';
import {useRefreshWidgets, useScreenSize} from 'state/hooks';
import {useStockPrices} from 'state/stocks';
import {summaryAssign, SummaryKey} from 'state/summary';
import {Account} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {PropertiesPaper} from 'components/dashboard/PropertiesPaper';

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
    const url = makeUrl(routes.reports.balanceByLocation, reportQueryParams);
    const stockPrices = useStockPrices();
    const [tab, setTab] = useState(0);
    const screenSize = useScreenSize();
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

                <HeaderWithTotals
                    title="Net Worth"
                    totals={getTotals([...cashWithTotal, ...creditWithTotal, ...brokerageWithTotal])}
                />

                <Divider />

                <br />

                {Object.entries(creditTotals).map(([currencyId, total]) => {
                    const sum = cashTotals[currencyId] + total;

                    return sum < 0 ? (
                        <Alert severity="warning" variant="outlined">
                            <AlertTitle>Overdraft</AlertTitle>
                            <span>
                                You have an overdraft of{' '}
                                <NumericValue colorize={false} currency={Number(currencyId)} value={Math.abs(sum)} />
                            </span>
                        </Alert>
                    ) : null;
                })}
            </Paper>
            <div>
                <Paper className={cls.paperNoPadding}>
                    <Tabs value={tab} onChange={(e, t) => setTab(t)}>
                        <Tab label="Accounts" />
                        <Tab label="Users" />
                        <Tab label="Categories" />
                    </Tabs>
                </Paper>
                {tab === 0 && (
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
                                                        screenSize.isSmall
                                                            ? [NameCol, CreditBalanceCol, CreditUsageCol]
                                                            : [
                                                                  NameCol,
                                                                  CreditBalanceCol,
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

                        {brokerageWithTotal.length > 0 && (
                            <>
                                <BrokeragePaper classes={cls} brokerageWithTotal={brokerageWithTotal} />

                                <StocksPaper classes={cls} accountOptions={accountOptions} stocks={data.stocks} />
                            </>
                        )}

                        <PropertiesPaper classes={cls} />
                    </>
                )}

                {tab === 1 && (
                    <Paper className={cls.paper}>
                        <UsersTab reportQueryParams={reportQueryParams} />
                    </Paper>
                )}
                {tab === 2 && (
                    <Paper className={cls.paper}>
                        <CategoriesTab reportQueryParams={reportQueryParams} />
                    </Paper>
                )}
            </div>
        </div>
    );
};

const getTotals = (accounts: CashAccount[]): Record<string, number> => {
    const totals = {};

    for (const [currencyId, accs] of Object.entries(_.groupBy(accounts, 'currency_id'))) {
        totals[currencyId] = accs.reduce((acc, c) => acc + c.total, 0);
    }

    return totals;
};

const getCostBasis = (cash: BalanceByLocation['cash'], account: Account) => {
    return cash.find((c) => c.money_location_id === account.id)?.sum ?? 0;
};

const HeaderWithTotals = ({title, totals}: {title: string; totals: Record<string, number>}) => (
    <CardHeader
        title={title}
        style={{paddingLeft: 0}}
        subheader={Object.entries(totals).map(([currencyId, total]) => (
            <div style={{fontSize: 24}}>
                <NumericValue currency={Number(currencyId)} value={total} />{' '}
            </div>
        ))}
    />
);

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: spacingSmall,

        [ScreenQuery.SMALL]: {
            gridTemplateColumns: '1fr',
        },
    },
    paperNoPadding: {
        marginBottom: spacingSmall,
    },
    paper: {
        padding: spacingNormal,
        marginBottom: spacingSmall,
    },
    cardHeader: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        '& .MuiCardHeader-title': {
            display: 'grid',
            alignItems: 'center',
            gridGap: spacingSmall,
            gridTemplateColumns: 'auto 1fr',
        },
    },
    cashCreditGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: spacingSmall,

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
