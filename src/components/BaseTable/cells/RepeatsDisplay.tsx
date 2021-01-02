import {TransactionModel} from 'components/transactions/types';
import {RepeatOptions} from 'defs/repeatOptions';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import * as React from 'react';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const repeatsText = item.repeat ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1] : '';

    return repeatsText ? (
        <>
            Every {item.repeat_factor} {repeatsText}
            <div>
                {item.repeat_occurrences} times{' '}
                {'until ' +
                    advanceRepeatDate(item, item.repeat_occurrences)
                        .toDate()
                        .toLocaleDateString()}
            </div>
        </>
    ) : null;
};
