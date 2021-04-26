import {sumArray} from 'js/utils/numbers';
import {flatten, map, mapValues, uniq, uniqBy} from 'lodash';
import {TransactionModel} from 'transactions/defs';

export const mergeTransactions = (items: TransactionModel[]): Partial<TransactionModel> | null => {
    const [, ...rest] = items;

    // nothing to do for one transaction selected
    if (!rest.length) {
        return null;
    }

    // cannot merge transactions from different accounts
    if (uniqBy(items, 'money_location_id').length > 1) {
        return null;
    }

    const base = {
        categories: uniq(flatten(map(items, 'categories'))),
        favorite: Math.max(...map(items, 'favorite')),
        item: uniq(map(items, 'item')).join(', '),
        weight: sumArray(map(items, 'weight') as number[]),
        users: mapValues(
            map(items, 'users').reduce((acc, users) => {
                for (const id in users) {
                    acc[id] = (acc[id] || 0) + users[id];
                }

                return acc;
            }, {}),
            (value) => Math.round(value / items.length),
        ),
    };

    // add up quantity when a single price exists
    if (uniqBy(items, 'price').length === 1) {
        return {
            ...base,
            quantity: sumArray(map(items, 'quantity')),
        };
    }

    // add up price when a single quantity exists
    if (uniqBy(items, 'quantity').length === 1) {
        return {
            ...base,
            price: sumArray(map(items, 'price')),
        };
    }

    return null;
};
