import {grey} from '@material-ui/core/colors';
import {TransactionModel} from 'components/transactions/types';
import {RepeatOptions} from 'defs/repeatOptions';
import * as React from 'react';
import {useScreenSize} from 'state/hooks';

export const RepeatsDisplay = ({item}: {item: TransactionModel}) => {
    const screenSize = useScreenSize();
    const repeatsText = item.repeat
        ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1]
        : '';
    const repeatsDisplay = (
        <span
            style={{fontSize: '1rem', color: grey[500]}}
            title={`${item.repeat_occurrences} occurrences`}
        >
            {screenSize.isLarge
                ? repeatsText
                : repeatsText
                ? `Repeats ${repeatsText}`
                : ''}
        </span>
    );

    return repeatsDisplay;
};
