import {Button} from '@material-ui/core';
import IconLoan from '@material-ui/icons/AccountBalance';
import IconCredit from '@material-ui/icons/CreditCard';
import IconCash from '@material-ui/icons/LocalAtm';
import {InvestmentAccountsPaper} from 'dashboard/InvestmentAccountsPaper';
import {BrokerageAccount, CashAccount} from 'dashboard/defs';
import {PaymentPlanDialog} from 'dashboard/PaymentPlanDialog';
import {groupBy} from 'lodash';
import React, {useState} from 'react';
import {AccountType} from 'accounts/defs';
import {DashboardAccordion} from 'dashboard/DashboardAccordion';
import {styled} from '@material-ui/core/styles';
import {LiquidGrid} from './LiquidGrid';
import {CreditGrid} from './CreditGrid';

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
                    <div data-testid="liquid">
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
                            ({title, accounts}, index) =>
                                accounts.length > 0 && (
                                    <DashboardAccordion key={index} headerTitle={title} headerIcon={<IconCash />}>
                                        {Object.entries(groupBy(accounts, 'currency_id')).map(([cid, data]) => (
                                            <LiquidGrid key={cid} rows={data} className={cls.table} />
                                        ))}
                                    </DashboardAccordion>
                                ),
                        )}
                    </div>
                )}

                {creditWithTotal.concat(loanWithTotal).length > 0 && (
                    <div data-testid="credit">
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
                                    <CreditCardsTitle>
                                        <span>Credit Cards</span>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPaymentPlanDialogIsOpen(true);
                                            }}
                                        >
                                            Payment Plan for Loans and Credit Cards
                                        </Button>
                                    </CreditCardsTitle>
                                ),
                                Icon: IconCredit,
                            },
                        ].map((group) =>
                            Object.values(groupBy(group.items, 'currency_id')).map((data, index) => (
                                <DashboardAccordion
                                    key={index}
                                    headerIcon={React.createElement(group.Icon)}
                                    headerTitle={group.getTitle()}
                                >
                                    <CreditGrid rows={data} className={cls.table} />
                                </DashboardAccordion>
                            )),
                        )}
                    </div>
                )}

                {brokerageWithTotal.length > 0 && (
                    <InvestmentAccountsPaper classes={cls} brokerageWithTotal={brokerageWithTotal} />
                )}
            </>
        </>
    );
};

const CreditCardsTitle = styled('div')((props) => ({
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto',
    gridGap: props.theme.spacing(1),
}));
