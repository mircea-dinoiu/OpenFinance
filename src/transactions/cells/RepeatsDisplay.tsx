import {TransactionModel} from 'transactions/defs';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import * as React from 'react';
import {locales} from 'app/locales';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const repeatsText = item.repeat ? locales.repeatOptions[item.repeat] : '';

    if (!repeatsText) {
        return null;
    }

    const ro = item.repeat_occurrences as number;

    return ro > 1 ? (
        <>
            Every {item.repeat_factor} {repeatsText}
            <div>
                {ro} times{' '}
                {'until ' +
                    advanceRepeatDate(item, ro - 1)
                        .toDate()
                        .toLocaleDateString()}
            </div>
        </>
    ) : (
        <>Final Transaction</>
    );
};
