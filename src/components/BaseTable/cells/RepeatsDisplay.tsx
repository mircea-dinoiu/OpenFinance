import {TransactionModel} from 'components/transactions/types';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import * as React from 'react';
import {locales} from 'locales';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const repeatsText = item.repeat ? locales.repeatOptions[item.repeat] : '';

    if (!repeatsText) {
        return null;
    }

    return (item.repeat_occurrences as number) > 1 ? (
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
    ) : (
        <>Final Transaction</>
    );
};
