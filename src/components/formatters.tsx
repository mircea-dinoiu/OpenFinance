import {green, grey, red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {Tooltip} from 'components/Tooltip';
import {spacingSmall} from 'defs/styles';
import {useCopyTextWithConfirmation} from 'helpers/clipboardService';
import {financialNum} from 'js/utils/numbers';
import * as React from 'react';
import {HTMLAttributes} from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';

const PrivateValue = (props: HTMLAttributes<HTMLSpanElement>) => (
    <span {...props}>▒▒▒▒</span>
);

export const formatNumber = (value: number) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(
        financialNum(value),
    );

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
        background: green[50],
        color: green[900],
        borderRadius: 5,
    },
    negative: {
        background: red[50],
        color: red[900],
        borderRadius: 5,
    },
    value: {
        cursor: 'grabbing',
    },
});

export const NumericValue = ({
    currency,
    value,
    colorize = true,
}: {
    currency: string;
    value: number;
    colorize?: boolean;
}) => {
    const cls = useStyles();
    const currencies = useCurrenciesMap();
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const inner = (
        <span
            className={
                colorize
                    ? clsx(
                          cls.container,
                          value > 0 && cls.positive,
                          value < 0 && cls.negative,
                      )
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
                    formatCurrency(value, currency)
                )}
            </strong>
        </span>
    );

    const found = Object.values(currencies).find(
        (each) => each.iso_code === currency,
    );
    const tooltip = [
        <div
            key={currency}
            style={{
                backgroundColor: grey[700],
                borderRadius: '3px',
                padding: `3px ${spacingSmall}`,
                margin: `0 -${spacingSmall} ${spacingSmall}`,
            }}
        >
            {formatCurrency(value, currency)}
        </div>,
        ...Object.entries(
            found ? found.rates : {},
        ).map(([rateISO, rateMulti]) => (
            <div key={rateISO}>
                {formatCurrency(value * rateMulti, rateISO)}
            </div>
        )),
    ];

    return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
};
