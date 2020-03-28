import React from 'react';
import {formatNumericValue} from 'components/formatters';

export const WeightDisplay = ({item}) => {
    if (item.weight == null) {
        return null;
    }

    if (item.weight > 1000) {
        return <>{formatNumericValue(item.weight / 1000)} kg</>;
    }

    return <>{formatNumericValue(item.weight)} g</>;
};
