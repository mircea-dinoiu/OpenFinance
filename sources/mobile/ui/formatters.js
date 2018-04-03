import React from 'react';
import {grey700} from 'material-ui/styles/colors';

export const numericValue = (value, currency = null) => {
    return <span>{currency && <span style={{color: grey700}}>{currency}</span>} {new Intl.NumberFormat().format(value)}</span>
};