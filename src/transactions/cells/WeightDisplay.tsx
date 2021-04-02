import {formatNumber} from 'components/formatters';
import {TransactionModel} from 'transactions/defs';
import React from 'react';

export const WeightDisplay = ({item}: {item: Pick<TransactionModel, 'weight'>}) => {
    if (item.weight == null) {
        return null;
    }

    if (item.weight > 1000) {
        return <>{formatNumber(item.weight / 1000)} kg</>;
    }

    return <>{formatNumber(item.weight)} g</>;
};
