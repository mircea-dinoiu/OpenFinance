// @flow
import { map, flatten, uniqBy, uniq, mapValues } from 'lodash';
import { sumArray } from 'shared/utils/numbers';

export const getDetachedItemUpdates = (item) => {
    const itemUpdates = { id: item.id, repeat: null };

    return itemUpdates;
};

export const mergeItems = (items) => {
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
