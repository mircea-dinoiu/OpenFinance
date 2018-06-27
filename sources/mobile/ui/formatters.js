import React from 'react';
import {grey700} from 'material-ui/styles/colors';
import {connect} from 'react-redux';
import Tooltip from 'common/components/Tooltip';

const formatNumericValue = (value) => new Intl.NumberFormat().format(value);
const NumericValue = connect(({currencies}) => ({currencies}))(
    ({
        currencies,
        currency,
        showCurrency = true,
        value,
        currencyStyle = {}
    }) => {
        const inner = (
            <span>
                {currency &&
                    showCurrency && (
                    <span style={{color: grey700, ...currencyStyle}}>
                        {currency}
                    </span>
                )}{' '}
                {formatNumericValue(value)}
            </span>
        );
        const tooltip = Object.values(
            currencies
                .get('map')
                .find((each) => each.get('iso_code') === currency)
                .get('rates')
                .map((rateMulti, rateISO) => (
                    <div key={rateISO}>
                        {rateISO} {formatNumericValue(value * rateMulti)}
                    </div>
                ))
                .toJS()
        );

        return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
    }
);

export const numericValue = (
    value,
    {currency, showCurrency = true, currencyStyle = {}} = {}
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
