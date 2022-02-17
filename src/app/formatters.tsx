import {useCopyTextWithConfirmation} from 'app/clipboardService';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import {useCurrenciesMap} from 'currencies/state';
import {usePrivacyToggle} from 'privacyToggle/state';
import {styled, Theme} from '@material-ui/core';

const PrivateValue = (props: HTMLAttributes<HTMLSpanElement>) => <span {...props}>▒▒▒▒</span>;

export const formatNumber = (value: number) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(financialNum(value));

const DEFAULT_DECIMAL_PLACES = 2;

const roundDecimals = (value: number, places: number) => {
    if (places === Infinity) {
        return value;
    }

    const decimal = new Decimal(value);

    return decimal
        .mul(10 ** places)
        .round()
        .div(10 ** places)
        .toNumber();
};

export const formatCurrency = (value: number, currency: string, decimalPlaces: number = DEFAULT_DECIMAL_PLACES) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimalPlaces,
    }).format(roundDecimals(value, decimalPlaces));
};

const NumericValueStyled = styled('span')(
    ({
        colorize,
        privacyToggle,
        value,
        theme,
        variant,
    }: {
        colorize: boolean;
        privacyToggle: boolean;
        value: number;
        theme: Theme;
        variant: NumericValueVariant;
    }) => {
        const style = {
            cursor: 'grabbing',
            fontWeight: 500,
        };
        const spacingFactor = variant === 'gridCell' ? 2 : 1;
        const padding = theme.spacing(0, spacingFactor);

        if (variant === 'tableCell') {
            Object.assign(style, {
                display: 'flex',
                width: `calc(100% + 2 * ${theme.spacing(spacingFactor)}px)`,
                height: `calc(100% + 2 * ${theme.spacing(spacingFactor)}px)`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                margin: theme.spacing(-spacingFactor, -spacingFactor, 0, -spacingFactor),
                padding,
            });
        }

        if (variant === 'gridCell') {
            Object.assign(style, {
                display: 'flex',
                width: `calc(100% + 2 * ${theme.spacing(spacingFactor)}px)`,
                height: `100%`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                margin: theme.spacing(0, -spacingFactor, 0, -spacingFactor),
                padding,
            });
        }

        if (colorize && !privacyToggle) {
            Object.assign(style, {
                ...(value > 0
                    ? {
                          background: theme.palette.success.main + '99',
                          color: theme.palette.success.contrastText,
                          padding,
                      }
                    : {}),
                ...(value < 0
                    ? {
                          background: theme.palette.error.main + '99',
                          color: theme.palette.error.contrastText,
                          padding,
                      }
                    : {}),
            });
        }

        if (variant === 'gridFooter' && style.hasOwnProperty('color')) {
            Object.assign(style, {
                margin: theme.spacing(0, -spacingFactor, 0, 0),
            });
        }

        return style;
    },
);

type NumericValueVariant = 'gridCell' | 'gridFooter' | 'tableCell' | 'inline';

export const NumericValue = ({
    currency: currencyFromProps,
    value,
    colorize = false,
    before,
    after,
    variant = 'inline',
    decimalPlaces = DEFAULT_DECIMAL_PLACES,
}: {
    currency?: string | number;
    value: number;
    colorize?: boolean;
    before?: ReactNode;
    after?: ReactNode;
    variant?: NumericValueVariant;
    decimalPlaces?: number;
}) => {
    const currencies = useCurrenciesMap();
    const currency = typeof currencyFromProps === 'number' ? currencies[currencyFromProps].iso_code : currencyFromProps;
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const valueToDisplay = currency ? formatCurrency(value, currency, decimalPlaces) : value;
    const inner = (
        <NumericValueStyled
            variant={variant}
            colorize={colorize}
            privacyToggle={privacyToggle}
            value={value}
            onClick={(e) => {
                e.stopPropagation();
                copyText(roundDecimals(value, decimalPlaces));
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
        </NumericValueStyled>
    );

    return inner;
};
