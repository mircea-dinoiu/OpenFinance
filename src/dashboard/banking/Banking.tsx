import {Button, CardHeader, Paper} from '@material-ui/core';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {BaseTable} from 'app/BaseTable';
import {BrokeragePaper} from 'dashboard/BrokeragePaper';
import {NameCol, ValueCol} from 'dashboard/columns';
import {CreditAprCol, CreditAvailableCol, CreditBalanceCol, CreditLimitCol, CreditUsageCol} from 'dashboard/Credit';
import {BrokerageAccount, CashAccount} from 'dashboard/defs';
import {PaymentPlanDialog} from 'dashboard/PaymentPlanDialog';
import {groupBy} from 'lodash';
import React, {useState} from 'react';
import {AccountType} from 'accounts/defs';

export const Banking = ({
    classes: cls,
    liquidWithTotal,
    creditWithTotal,
    loanWithTotal,
    brokerageWithTotal,
}: {
    classes: Record<string, string>;
    liquidWithTotal: CashAccount[];
    creditWithTotal: CashAccount[];
    loanWithTotal: CashAccount[];
    brokerageWithTotal: BrokerageAccount[];
}) => {
    const [paymentPlanDialogIsOpen, setPaymentPlanDialogIsOpen] = useState(false);

    return (
        <>
            <>
                {liquidWithTotal.length > 0 && (
                    <Paper className={cls.paper} data-testid="liquid">
                        {[
                            // Specifically hide 0 balance accounts for cash, not for the others though
                            {
                                title: 'Cash',
                                accounts: liquidWithTotal.filter((a) => a.type === AccountType.CASH && a.total !== 0),
                            },
                            {
                                title: 'Checking',
                                accounts: liquidWithTotal.filter((a) => a.type === AccountType.CHECKING),
                            },
                            {
                                title: 'Savings',
                                accounts: liquidWithTotal.filter((a) => a.type === AccountType.SAVINGS),
                            },
                        ].map(
                            ({title, accounts}) =>
                                accounts.length > 0 && (
                                    <section>
                                        <CardHeader
                                            className={cls.cardHeader}
                                            title={
                                                <>
                                                    <IconCash /> {title}
                                                </>
                                            }
                                        />

                                        {Object.values(groupBy(accounts, 'currency_id')).map((data) => (
                                            <BaseTable
                                                defaultSorted={[{id: 'value', desc: true}]}
                                                className={cls.table}
                                                data={data}
                                                columns={[NameCol, ValueCol]}
                                            />
                                        ))}
                                    </section>
                                ),
                        )}
                    </Paper>
                )}

                {creditWithTotal.concat(loanWithTotal).length > 0 && (
                    <Paper className={cls.paper} data-testid="credit">
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
                                getTitle: () => 'Loans',
                                Icon: IconLoan,
                            },
                            {
                                items: creditWithTotal,
                                getTitle: () => (
                                    <div style={{display: 'flex'}}>
                                        <span style={{flexGrow: 1}}>Credit Cards</span>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => setPaymentPlanDialogIsOpen(true)}
                                        >
                                            Payment Plan for Loans and Credit Cards
                                        </Button>
                                    </div>
                                ),
                                Icon: IconCredit,
                            },
                        ].map((group) =>
                            Object.values(groupBy(group.items, 'currency_id')).map((data) => (
                                <>
                                    <CardHeader
                                        className={cls.cardHeader}
                                        title={
                                            <>
                                                {React.createElement(group.Icon)}
                                                <span>{group.getTitle()}</span>
                                            </>
                                        }
                                    />
                                    <BaseTable
                                        defaultSorted={[{id: 'balance', desc: true}]}
                                        className={cls.table}
                                        data={data}
                                        columns={[
                                            NameCol,
                                            CreditBalanceCol,
                                            CreditAvailableCol,
                                            CreditLimitCol,
                                            CreditUsageCol,
                                            CreditAprCol,
                                        ]}
                                    />
                                </>
                            )),
                        )}
                    </Paper>
                )}

                {brokerageWithTotal.length > 0 && (
                    <BrokeragePaper classes={cls} brokerageWithTotal={brokerageWithTotal} />
                )}
            </>
        </>
    );
};
