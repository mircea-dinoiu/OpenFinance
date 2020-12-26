import {TransactionModel} from 'components/transactions/types';
import {RepeatOptions} from 'defs/repeatOptions';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import * as React from 'react';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const repeatsText = item.repeat ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1] : '';

    return repeatsText ? (
        <>
            {repeatsText} ({item.repeat_occurrences})
            <div>
                {'until ' +
                    advanceRepeatDate(
                        {
                            created_at: item.created_at,
                            repeat: item.repeat,
                        },
                        item.repeat_occurrences,
                    )
                        .toDate()
                        .toLocaleDateString()}
            </div>
        </>
    ) : null;
};
