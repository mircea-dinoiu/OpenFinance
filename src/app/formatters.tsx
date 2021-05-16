import {useCopyTextWithConfirmation} from 'app/clipboardService';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import * as React from 'react';
import {HTMLAttributes, ReactNode, CSSProperties} from 'react';
import {useCurrenciesMap} from 'currencies/state';
import {usePrivacyToggle} from 'privacyToggle/state';
import {styled, Theme} from '@material-ui/core';

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

const NumericValueStyled = styled('span')(
    ({
        colorize,
        privacyToggle,
        value,
        theme,
        isExpanded,
    }: {
        colorize: boolean;
        privacyToggle: boolean;
        value: number;
        theme: Theme;
        isExpanded: boolean;
    }) => {
        const style = {
            cursor: 'grabbing',
            fontWeight: 500,
        };

        if (isExpanded) {
            Object.assign(style, {
                display: 'flex',
                width: `calc(100% + 2 * ${theme.spacing(1)}px)`,
                height: `calc(100% + 2 * ${theme.spacing(1)}px)`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                margin: theme.spacing(-1, 0, 0, -1),
                padding: theme.spacing(0, 1),
            });
        }

        if (colorize && !privacyToggle) {
            Object.assign(style, {
                ...(value > 0
                    ? {
                          background: theme.palette.success.main + '99',
                          color: theme.palette.success.contrastText,
                          padding: theme.spacing(0, 1),
                      }
                    : {}),
                ...(value < 0
                    ? {
                          background: theme.palette.error.main + '99',
                          color: theme.palette.error.contrastText,
                          padding: theme.spacing(0, 1),
                      }
                    : {}),
            });
        }

        return style;
    },
);

export const NumericValue = ({
    currency: currencyFromProps,
    value,
    colorize = false,
    before,
    after,
    isExpanded = false,
}: {
    currency?: string | number;
    value: number;
    colorize?: boolean;
    before?: ReactNode;
    after?: ReactNode;
    isExpanded?: boolean;
}) => {
    const currencies = useCurrenciesMap();
    const currency = typeof currencyFromProps === 'number' ? currencies[currencyFromProps].iso_code : currencyFromProps;
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const valueToDisplay = currency ? formatCurrency(value, currency) : value;
    const inner = (
        <NumericValueStyled
            isExpanded={isExpanded}
            colorize={colorize}
            privacyToggle={privacyToggle}
            value={value}
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
        </NumericValueStyled>
    );

    return inner;
};
