import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {Tooltip} from 'app/Tooltip';
import {useCopyTextWithConfirmation} from 'app/clipboardService';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import {useCurrenciesMap} from 'currencies/state';
import {usePrivacyToggle} from 'privacyToggle/state';
import {colors} from 'app/styles/colors';

const PrivateValue = (props: HTMLAttributes<HTMLSpanElement>) => <span {...props}>▒▒▒▒</span>;

export const formatNumber = (value: number) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(financialNum(value));

export const formatCurrency = (value: number, currency: string) => {
    const decimal = new Decimal(value);

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(
        decimal
            .mul(100)
            .floor()
            .div(100)
            .toNumber(),
    );
};

const useStyles = makeStyles((theme) => ({
    container: {
        borderRadius: 5,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    positive: {
        background: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        borderRadius: 5,
    },
    negative: {
        background: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        borderRadius: 5,
    },
    value: {
        cursor: 'grabbing',
        fontWeight: 500,
    },
    tooltipParts: {
        display: 'grid',
        gridGap: theme.spacing(2),
        gridTemplateColumns: '1fr',
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    tooltipPart: {
        backgroundColor: colors.tooltipBg,
        margin: 0,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    },
}));

export const NumericValue = ({
    currency: currencyFromProps,
    value,
    colorize = false,
    tooltip: tooltipFromProps,
    before,
    after,
}: {
    tooltip?: ReactNode;
    currency?: string | number;
    value: number;
    colorize?: boolean;
    before?: ReactNode;
    after?: ReactNode;
}) => {
    const cls = useStyles();
    const currencies = useCurrenciesMap();
    const currency = typeof currencyFromProps === 'number' ? currencies[currencyFromProps].iso_code : currencyFromProps;
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const valueToDisplay = currency ? formatCurrency(value, currency) : value;
    const inner = (
        <span
            className={
                colorize && !privacyToggle
                    ? clsx(cls.container, value > 0 && cls.positive, value < 0 && cls.negative)
                    : undefined
            }
        >
            <span
                className={cls.value}
                onClick={(e) => {
                    e.stopPropagation();
                    copyText(value);
                }}
            >
                {privacyToggle ? (
                    <PrivateValue />
                ) : (
                    <>
                        {before}
                        {valueToDisplay}
                        {after}
                    </>
                )}
            </span>
        </span>
    );

    if (!tooltipFromProps) {
        return inner;
    }

    return (
        <Tooltip
            tooltip={
                <ul className={cls.tooltipParts}>
                    {React.Children.map(tooltipFromProps, (child, key) => (
                        <li className={cls.tooltipPart} key={key}>
                            {child}
                        </li>
                    ))}
                </ul>
            }
        >
            {inner}
        </Tooltip>
    );
};
