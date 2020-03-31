import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import {Tooltip} from 'components/Tooltip';
import {financialNum} from 'js/utils/numbers';
import {spacingSmall} from 'defs/styles';
import {useCurrencies} from 'state/currencies';
import {useSuccessSnackbar} from 'components/snackbars';
import {makeStyles} from '@material-ui/core/styles';
import {copyText} from 'helpers/clipboardService';

export const formatNumericValue = (value) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(
        financialNum(value),
    );

const useStyles = makeStyles({
    value: {
        cursor: 'grabbing',
    },
});

const NumericValue = ({
    currency: rawCurrency,
    showCurrency = true,
    value,
    currencyStyle = {},
}) => {
    const cls = useStyles();
    const currencies = useCurrencies();
    const currency = rawCurrency || currencies.selected.iso_code;
    const showSuccessSnackbar = useSuccessSnackbar();
    const inner = (
        <span>
            {currency && showCurrency && (
                <span style={{color: grey[500], ...currencyStyle}}>
                    {currency}
                </span>
            )}{' '}
            <strong
                className={cls.value}
                onClick={() => {
                    if (copyText(value)) {
                        showSuccessSnackbar({
                            message: (
                                <span>
                                    Copied <strong>{value}</strong> to clipboard
                                </span>
                            ),
                        });
                    }
                }}
            >
                {formatNumericValue(value)}
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
            {currency} {formatNumericValue(value)}
        </div>,
        ...Object.entries(found ? found.rates : {}).map(
            ([rateISO, rateMulti]) => (
                <div key={rateISO}>
                    {rateISO} {formatNumericValue(value * rateMulti)}
                </div>
            ),
        ),
    ];

    return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
};

export const numericValue = (
    value: number,
    {
        currency,
        showCurrency = true,
        currencyStyle = {},
    }: {
        currency?: string;
        showCurrency?: boolean;
        currencyStyle?: {};
    } = {},
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
