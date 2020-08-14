import {TransactionModel} from 'components/transactions/types';
import {RepeatOptions} from 'defs/repeatOptions';
import * as React from 'react';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const repeatsText = item.repeat
        ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1]
        : '';

    return <>{repeatsText && `${repeatsText} (${item.repeat_occurrences})`}</>;
};
