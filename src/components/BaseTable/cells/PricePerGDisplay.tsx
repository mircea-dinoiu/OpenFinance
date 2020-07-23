import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';
import * as React from 'react';
import {TransactionModel} from 'types';

export const PricePerGDisplay = ({item}: {item: TransactionModel}) =>
    item.sum_per_weight != null ? (
        <React.Fragment>
            <AmountDisplay
                item={{
                    money_location: item.money_location,
                    sum: item.sum_per_weight,
                }}
            />
            /g
        </React.Fragment>
    ) : (
        <></>
    );
