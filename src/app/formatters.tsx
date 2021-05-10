import {Tooltip} from 'app/Tooltip';
import {useCopyTextWithConfirmation} from 'app/clipboardService';
import Decimal from 'decimal.js';
import {financialNum} from 'app/numbers';
import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import {useCurrenciesMap} from 'currencies/state';
import {usePrivacyToggle} from 'privacyToggle/state';
import {colors} from 'app/styles/colors';
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
    }: {
        colorize: boolean;
        privacyToggle: boolean;
        value: number;
        theme: Theme;
    }) => {
        return colorize && !privacyToggle
            ? {
                  borderRadius: 5,
                  paddingLeft: theme.spacing(1),
                  paddingRight: theme.spacing(1),
                  ...(value > 0
                      ? {
                            background: theme.palette.success.main,
                            color: theme.palette.success.contrastText,
                            borderRadius: 5,
                        }
                      : {}),
                  ...(value < 0
                      ? {
                            background: theme.palette.error.main,
                            color: theme.palette.error.contrastText,
                            borderRadius: 5,
                        }
                      : {}),
              }
            : {};
    },
);

const Value = styled('span')({
    cursor: 'grabbing',
    fontWeight: 500,
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
    const currencies = useCurrenciesMap();
    const currency = typeof currencyFromProps === 'number' ? currencies[currencyFromProps].iso_code : currencyFromProps;
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const valueToDisplay = currency ? formatCurrency(value, currency) : value;
    const inner = (
        <NumericValueStyled colorize={colorize} privacyToggle={privacyToggle} value={value}>
            <Value
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
            </Value>
        </NumericValueStyled>
    );

    if (!tooltipFromProps) {
        return inner;
    }

    return (
        <Tooltip
            tooltip={
                <TooltipParts>
                    {React.Children.map(tooltipFromProps, (child, key) => (
                        <TooltipPart key={key}>{child}</TooltipPart>
                    ))}
                </TooltipParts>
            }
        >
            {inner}
        </Tooltip>
    );
};

const TooltipPart = styled('li')(({theme}) => ({
    backgroundColor: colors.tooltipBg,
    margin: 0,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

const TooltipParts = styled('ul')(({theme}) => ({
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
}));
