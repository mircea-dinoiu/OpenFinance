import {objectEntriesOfSameType, objectValuesOfSameType} from 'utils/collection';
import * as React from 'react';
import {grey} from '@material-ui/core/colors';
import Tooltip from 'components/Tooltip';
import {financialNum} from 'js/utils/numbers';
import {getBaseCurrency} from '../helpers/currency';
import {useCurrencies} from 'state/hooks';
import {spacingSmall} from '../defs/styles';

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

    const found = objectValuesOfSameType(currencies.map).find(
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
    value: number,
    {currency, showCurrency = true, currencyStyle = {}}: {
        currency?: string,
        showCurrency?: boolean,
        currencyStyle?: {},
    } = {},
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
