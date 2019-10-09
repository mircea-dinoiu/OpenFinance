// @flow weak
import {
    objectEntriesOfSameType,
    objectValuesOfSameType,
} from 'common/utils/collection';
import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import Tooltip from 'common/components/Tooltip';
import {financialNum} from 'shared/utils/numbers';
import {getBaseCurrency} from '../../common/helpers/currency';
import {useCurrencies} from 'common/state/hooks';

export const formatNumericValue = (value) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(
        financialNum(value),
    );
const NumericValue = ({
    currency: rawCurrency,
    showCurrency = true,
    value,
    currencyStyle = {},
}) => {
    const currencies = useCurrencies();
    const currency = rawCurrency || getBaseCurrency(currencies).iso_code;
    const inner = (
        <span>
            {currency && showCurrency && (
                <span style={{color: grey[500], ...currencyStyle}}>
                    {currency}
                </span>
            )}{' '}
            <strong>{formatNumericValue(value)}</strong>
        </span>
    );

    let found = objectValuesOfSameType(currencies.map).find(
        (each) => each.iso_code === currency,
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
        ...objectEntriesOfSameType(found ? found.rates : {}).map(
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
    value,
    {currency, showCurrency = true, currencyStyle = {}} = {},
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
