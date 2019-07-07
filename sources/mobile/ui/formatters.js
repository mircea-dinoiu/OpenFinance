import * as React from 'react';
import { grey } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import Tooltip from 'common/components/Tooltip';
import { financialNum } from 'shared/utils/numbers';
import { getBaseCurrency } from '../../common/helpers/currency';

export const formatNumericValue = (value) =>
    new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 }).format(
        financialNum(value),
    );
const NumericValue = connect(({ currencies }) => ({ currencies }))(
    ({
        currencies,
        currency = getBaseCurrency(currencies).iso_code,
        showCurrency = true,
        value,
        currencyStyle = {},
    }) => {
        const inner = (
            <span>
                {currency && showCurrency && (
                    <span style={{ color: grey[500], ...currencyStyle }}>
                        {currency}
                    </span>
                )}{' '}
                <strong>{formatNumericValue(value)}</strong>
            </span>
        );
        const tooltip = [
            <div
                key={currency}
                style={{
                    backgroundColor: grey[700],
                    borderRadius: '3px',
                    padding: '3px 5px',
                    margin: '0 -5px 5px',
                }}
            >
                {currency} {formatNumericValue(value)}
            </div>,
            ...Object.values(
                Object.entries(
                    Object.values(currencies.map).find(
                        (each) => each.iso_code === currency,
                    ).rates,
                ).map(([rateISO, rateMulti]) => (
                    <div key={rateISO}>
                        {rateISO} {formatNumericValue(value * rateMulti)}
                    </div>
                )),
            ),
        ];

        return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
    },
);

export const numericValue = (
    value,
    { currency, showCurrency = true, currencyStyle = {} } = {},
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
