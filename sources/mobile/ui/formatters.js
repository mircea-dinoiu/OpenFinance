import React from 'react';
import {grey700} from 'material-ui/styles/colors';
import {Tooltip} from 'react-tippy';
import {connect} from 'react-redux';

const formatNumericValue = value => new Intl.NumberFormat().format(value);

const NumericValue = connect(({currencies}) => ({currencies}))(
    ({currencies, currency, showCurrency = true, value, currencyStyle = {}}) => {
        const inner = <span>{currency && showCurrency && <span style={{color: grey700, ...currencyStyle}}>{currency}</span>} {formatNumericValue(value)}</span>;

        const html = Object.values(
            currencies.get('map').find(each => each.get('iso_code') === currency).get('rates').map((rateMulti, rateISO) => {
                return <div style={{
                    fontSize: '12px',
                    textAlign: 'left'
                }}>{rateISO} {formatNumericValue(value * rateMulti)}</div>;
            }).toJS()
        );

        return (
            <Tooltip
                html={html}
                position="bottom"
                trigger="mouseenter"
                size="big"
            >
                {inner}
            </Tooltip>
        );
    }
);

export const numericValue = (value, {currency, showCurrency = true, currencyStyle = {}} = {}) => {
    return (
        <NumericValue
            value={value}
            currency={currency}
            showCurrency={showCurrency}
            currencyStyle={currencyStyle}
        />
    );
};