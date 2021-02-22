import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core';
import IconAddCircle from '@material-ui/icons/AddCircle';
import IconClear from '@material-ui/icons/Clear';
import IconRemoveCircle from '@material-ui/icons/RemoveCircle';
import {CashAccount} from 'components/dashboard/defs';
import {NumericValue} from 'components/formatters';
import {StorageKey} from 'defs';
import {locales} from 'locales';
import {cloneDeep, orderBy} from 'lodash';
import moment, {Moment} from 'moment';
import * as React from 'react';
import {useMemo} from 'react';
import createPersistedState from 'use-persisted-state';
import {makeStyles} from '@material-ui/core/styles';
import {spacingNormal} from 'defs/styles';

const useAddlCashFlowState = createPersistedState(StorageKey.paymentDialogAddlCashFlow);
const useSkipPayments = createPersistedState(StorageKey.paymentDialogSkipPayments);
const useAprThreshold = createPersistedState(StorageKey.paymentDialogAprThreshold);

type PaymentPlanPayment = CashAccount & {date: Moment; paid: number; paidExtra: number};

export const PaymentPlanDialog = ({
    open,
    onClose,
    creditWithTotal,
}: {
    open: boolean;
    onClose: () => unknown;
    creditWithTotal: CashAccount[];
}) => {
    const [offset, setOffset] = useSkipPayments(0);
    const [addlCashFlow, setAddlCashFlow] = useAddlCashFlowState(0);
    const [aprThreshold, setAprThreshold] = useAprThreshold(0);
    const cls = useStyles();

    const {months} = useMemo(() => {
        const months: PaymentPlanPayment[][] = [];
        const startDate = moment();
        let paymentIndex = 0;
        let month = startDate.toDate();
        const creditWithTotalCopy = cloneDeep(
            orderBy(creditWithTotal, ['credit_dueday', 'credit_apr'], ['asc', 'desc']),
        );
        const getAccountsWithBalance = () =>
            creditWithTotalCopy.filter((acc) => acc.total < 0 && acc.credit_minpay != null && acc.credit_minpay > 0);
        let accountsWithBalance;

        while ((accountsWithBalance = getAccountsWithBalance()).length > 0) {
            const batch: Record<number, PaymentPlanPayment> = {};
            let totalPaid = 0;
            let totalOwed = 0;

            accountsWithBalance.forEach((acc) => {
                const date = moment(month);

                date.set({date: acc.credit_dueday ?? 1});

                // acc.credit_minpay is a redundant condition, this is always true
                if (date.isSameOrAfter(startDate) && acc.credit_minpay) {
                    totalOwed += -acc.total;

                    const paid = offset > paymentIndex ? 0 : Math.min(Math.abs(acc.total), acc.credit_minpay);

                    acc.total += paid;
                    totalOwed += paid;

                    batch[acc.id] = {
                        ...acc,
                        date: date,
                        paid: paid,
                        paidExtra: 0,
                    };

                    totalPaid += paid;
                    paymentIndex++;
                }
            });

            const budget = addlCashFlow + totalPaid;

            while (
                totalOwed > 0 &&
                budget > totalPaid &&
                (accountsWithBalance = getAccountsWithBalance().filter((acc) => {
                    const batchEntry = batch[acc.id];

                    return (
                        batchEntry != null &&
                        batchEntry.paid > 0 &&
                        acc.total < 0 &&
                        (acc.credit_apr ?? 0) > aprThreshold
                    );
                })).length > 0
            ) {
                orderBy(accountsWithBalance, ['credit_apr'], ['desc']).forEach((acc) => {
                    const paid = Math.min(Math.abs(acc.total), budget - totalPaid);

                    acc.total += paid;
                    totalOwed += paid;

                    batch[acc.id].total += paid;
                    batch[acc.id].paid += paid;
                    batch[acc.id].paidExtra += paid;

                    totalPaid += paid;
                });
            }

            months.push(
                orderBy(
                    Object.values(batch).filter((acc) => acc.paid),
                    ['date', 'credit_apr'],
                    ['asc', 'desc'],
                ),
            );

            month = new Date(month);
            month.setMonth(month.getMonth() + 1);
        }

        return {months};
    }, [creditWithTotal, addlCashFlow, offset, aprThreshold]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle>
                <div className={cls.header}>
                    <TextField
                        type="number"
                        label="Add'l Monthly Cash Flow"
                        value={addlCashFlow}
                        onChange={(e) => setAddlCashFlow(Number(e.target.value))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        disabled={addlCashFlow === 0}
                                        onClick={() => setAddlCashFlow(Math.max(addlCashFlow - 100, 0))}
                                    >
                                        <IconRemoveCircle />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setAddlCashFlow(addlCashFlow + 100)}>
                                        <IconAddCircle />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        type="number"
                        label="Skip Payments"
                        value={offset}
                        InputProps={{
                            readOnly: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton disabled={offset === 0} onClick={() => setOffset(offset - 1)}>
                                        <IconRemoveCircle />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setOffset(offset + 1)}>
                                        <IconAddCircle />
                                    </IconButton>
                                    <IconButton onClick={() => setOffset(0)}>
                                        <IconClear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        type="number"
                        label={locales.aprThreshold}
                        value={aprThreshold}
                        onChange={(e) => setAprThreshold(Math.max(0, Number(e.target.value)))}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Account</TableCell>
                                <TableCell align="right">{locales.apr}</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="right">Min Payment</TableCell>
                                <TableCell align="right">Add'l Payment</TableCell>
                                <TableCell align="right">Total Payment</TableCell>
                                <TableCell align="right">Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {months.map(
                                (month) =>
                                    month.length > 0 && (
                                        <>
                                            {month.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell align="right">{p.credit_apr}%</TableCell>
                                                    <TableCell align="center">{p.date.format('L')}</TableCell>
                                                    <TableCell align="right">
                                                        <NumericValue
                                                            value={p.paid - p.paidExtra}
                                                            currency={p.currency_id}
                                                            colorize={true}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {p.paidExtra > 0 ? (
                                                            <NumericValue
                                                                value={p.paidExtra}
                                                                currency={p.currency_id}
                                                                colorize={true}
                                                            />
                                                        ) : (
                                                            locales.mdash
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericValue
                                                            value={p.paid}
                                                            currency={p.currency_id}
                                                            colorize={true}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <NumericValue
                                                            value={p.total}
                                                            currency={p.currency_id}
                                                            colorize={true}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={4}>&nbsp;</TableCell>
                                            </TableRow>
                                        </>
                                    ),
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles({
    header: {
        display: 'grid',
        gridGap: spacingNormal,
        gridTemplateColumns: '1fr 1fr 1fr',
    },
});
