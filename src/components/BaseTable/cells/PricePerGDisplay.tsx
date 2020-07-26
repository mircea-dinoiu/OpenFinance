import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';

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
