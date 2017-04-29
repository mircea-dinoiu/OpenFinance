import React from 'react';
import {grey700} from 'material-ui/styles/colors';

export const numericValue = (value, currencyISOCode) => {
    return <span><span style={{color: grey700}}>{currencyISOCode}</span> {new Intl.NumberFormat().format(value)}</span>
};