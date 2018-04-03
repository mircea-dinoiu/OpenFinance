import React from 'react';
import {grey700} from 'material-ui/styles/colors';

export const numericValue = (value, {currency = null, currencyStyle = {}} = {}) => {
    return <span>{currency && <span style={{color: grey700, ...currencyStyle}}>{currency}</span>} {new Intl.NumberFormat().format(value)}</span>
};