import {Button, CardHeader, Paper, Theme, useMediaQuery} from '@material-ui/core';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {BaseTable} from 'app/BaseTable';
import {BrokeragePaper} from 'dashboard/BrokeragePaper';
import {NameCol, ValueCol} from 'dashboard/columns';
import {
    CreditAprCol,
    CreditAvailableCol,
    CreditBalanceCol,
    CreditLimitCol,
    CreditUsageCol,
} from 'dashboard/Credit';
import {BrokerageAccount, CashAccount} from 'dashboard/defs';
import {PaymentPlanDialog} from 'dashboard/PaymentPlanDialog';
import {groupBy} from 'lodash';
import React, {useState} from 'react';

export const Banking = ({
    classes: cls,
    cashWithTotal,
    creditWithTotal,
    loanWithTotal,
    brokerageWithTotal,
}: {
    classes: Record<string, string>;
    cashWithTotal: CashAccount[];
    creditWithTotal: CashAccount[];
    loanWithTotal: CashAccount[];
    brokerageWithTotal: BrokerageAccount[];
}) => {
    const [paymentPlanDialogIsOpen, setPaymentPlanDialogIsOpen] = useState(false);

    return (
        <>
            <>
                {cashWithTotal.length > 0 && (
                    <Paper className={cls.paper} data-testid="cash">
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
