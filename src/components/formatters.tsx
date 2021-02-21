import {green, grey, red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {Tooltip} from 'components/Tooltip';
import {colors, spacingNormal, spacingSmall, theme} from 'defs/styles';
import {useCopyTextWithConfirmation} from 'helpers/clipboardService';
import {financialNum} from 'js/utils/numbers';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';

const PrivateValue = (props: HTMLAttributes<HTMLSpanElement>) => <span {...props}>▒▒▒▒</span>;

export const formatNumber = (value: number) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(financialNum(value));

export const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(value);
};

const useStyles = makeStyles({
    container: {
        borderRadius: 5,
        paddingLeft: spacingSmall,
        paddingRight: spacingSmall,
    },
    positive: {
        background: colors.positiveNumberBg,
        color: green[50],
        borderRadius: 5,
    },
    negative: {
        background: red[900],
        color: red[50],
        borderRadius: 5,
    },
    value: {
        cursor: 'grabbing',
    },
    tooltipParts: {
        display: 'grid',
        gridGap: spacingNormal,
        gridTemplateColumns: '1fr',
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    tooltipPart: {
        backgroundColor: grey[800],
        margin: 0,
        padding: spacingSmall,
        borderRadius: theme.shape.borderRadius,
    },
});

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
            <strong
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
            </strong>
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
