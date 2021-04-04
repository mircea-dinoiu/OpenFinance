import {Button, CardHeader, Paper, Theme, useMediaQuery} from '@material-ui/core';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {BaseTable} from 'app/BaseTable';
import {NameCol, ValueCol} from 'dashboard/columns';
import {CreditAprCol, CreditAvailableCol, CreditBalanceCol, CreditLimitCol, CreditUsageCol} from 'dashboard/Credit';
import {CashAccount} from 'dashboard/defs';
import {PaymentPlanDialog} from 'dashboard/PaymentPlanDialog';
import {groupBy} from 'lodash';
import React, {useState} from 'react';

export const Banking = ({
    classes: cls,
    cashWithTotal,
    creditWithTotal,
    loanWithTotal,
}: {
    classes: Record<string, string>;
    cashWithTotal: CashAccount[];
    creditWithTotal: CashAccount[];
    loanWithTotal: CashAccount[];
}) => {
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [paymentPlanDialogIsOpen, setPaymentPlanDialogIsOpen] = useState(false);

    return (
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
                        <Button color="primary" variant="contained" onClick={() => setPaymentPlanDialogIsOpen(true)}>
                            Payment Plan for Loans and Credit Cards
                        </Button>
                    </Paper>
                )}
            </>
        </>
    );
};
