import React from 'react';
import {formatNumber} from 'components/formatters';

export const WeightDisplay = ({item}) => {
    if (item.weight == null) {
        return null;
    }

    if (item.weight > 1000) {
        return <>{formatNumber(item.weight / 1000)} kg</>;
    }

    return <>{formatNumber(item.weight)} g</>;
};
