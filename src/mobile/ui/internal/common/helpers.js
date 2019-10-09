// @ flow
import type {TypeTransactionModel} from 'common/types';
import {map, flatten, uniqBy, uniq, mapValues, sortBy} from 'lodash';
import {sumArray} from 'shared/utils/numbers';

export const mapItemToRepeatedUpdates = (item: TypeTransactionModel) => {
    const extra = {};

    if (item.repeat_occurrences) {
        extra.repeat_occurrences = item.repeat_occurrences - 1;

        if (extra.repeat_occurrences === 0) {
            extra.repeat_occurrences = null;
        }
    }

    return extra;
};

export const mapItemToDetachedUpdates = (item: TypeTransactionModel) => ({
    id: item.id,
    repeat: null,
});

export const mergeItems = (items: TypeTransactionModel[]) => {
    const [, ...rest] = items;

    if (!rest.length || uniqBy(items, 'money_location_id').length > 1) {
        return null;
    }

    return {
        categories: uniq(flatten(map(items, 'categories'))),
        favorite: Math.max(...map(items, 'favorite')),
        item: uniq(map(items, 'item')).join(', '),
        notes: uniq(map(items, 'notes')).join(', '),
        sum: sumArray(map(items, 'sum')),
        weight: sumArray(map(items, 'weight')),
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
};

export const sortMoneyLocations = (items) =>
    sortBy(
        items,
        (item) =>
            `${['open', 'locked', 'closed'].indexOf(item.status)}#${item.name}`,
    );
