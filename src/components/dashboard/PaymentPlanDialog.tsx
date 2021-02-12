import {
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core';
import {CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {cloneDeep, orderBy} from 'lodash';
import moment from 'moment';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useEndDate} from 'utils/dates';

type PaymentPlanPayment = CashAccount & {date: Date; paid: number};

export const PaymentPlanDialog = ({
    open,
    onClose,
    creditWithTotal,
}: {
    open: boolean;
    onClose: () => unknown;
    creditWithTotal: CashAccount[];
}) => {
    const months: PaymentPlanPayment[][] = [];
    const [endDate] = useEndDate();
    let date = new Date(endDate);
    const creditWithTotalCopy = cloneDeep(orderBy(creditWithTotal, ['credit_apr'], ['desc']));
    const [budget, setBudget] = useState(0);
    const getAccountsWithBalance = () =>
        creditWithTotalCopy.filter((acc) => acc.total < 0 && acc.credit_minpay != null && acc.credit_minpay > 0);
    let maxPaidInAMonth = 0;

    while (getAccountsWithBalance().length > 0) {
        const batch: Record<number, PaymentPlanPayment> = {};
        let totalPaid = 0;

        getAccountsWithBalance().forEach((acc) => {
            if (acc.credit_minpay) {
                // redundant condition, this is always true
                const paid = Math.min(Math.abs(acc.total), acc.credit_minpay);

                acc.total += paid;

                batch[acc.id] = {
                    ...acc,
                    date,
                    paid: paid,
                };

                totalPaid += paid;
            }
        });

        while (budget > totalPaid && getAccountsWithBalance().length > 0) {
            getAccountsWithBalance().forEach((acc) => {
                const paid = Math.min(Math.abs(acc.total), budget - totalPaid);

                acc.total += paid;

                batch[acc.id].paid += paid;

                totalPaid += paid;
            });
        }

        maxPaidInAMonth = Math.max(maxPaidInAMonth, totalPaid);

        months.push(orderBy(Object.values(batch), ['credit_apr'], ['desc']));

        date = new Date(date);
        date.setMonth(date.getMonth() + 1);
    }

    useEffect(() => {
        if (maxPaidInAMonth > budget) {
            setBudget(maxPaidInAMonth);
        }
    }, [maxPaidInAMonth]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle>
                <TextField
                    type="number"
                    label="Monthly Budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                />
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Account</TableCell>
                                <TableCell align="right">APR</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Remaining</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {months.map((month, i) => (
                                <>
                                    {month.map((p) => (
                                        <TableRow key={i}>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell align="right">{p.credit_apr}%</TableCell>
                                            <TableCell align="center">{moment(p.date).format('MMM YYYY')}</TableCell>
                                            <TableCell align="right">
                                                <NumericValue value={p.paid} currency={p.currency_id} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <NumericValue value={Math.abs(p.total)} currency={p.currency_id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={4}>&nbsp;</TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};
