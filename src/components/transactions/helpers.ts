import {IncludeOption} from 'defs';
import {TransactionModel} from 'types';
import {flatten, map, mapValues, sortBy, uniq, uniqBy} from 'lodash';
import {sumArray} from 'js/utils/numbers';
import {useQueryParamState} from 'utils/url';

export const mapItemToRepeatedUpdates = (item: TransactionModel) => {
    const extra: {
        repeat_occurrences?: number | null;
    } = {};

    if (item.repeat_occurrences) {
        extra.repeat_occurrences = item.repeat_occurrences - 1;

        if (extra.repeat_occurrences === 0) {
            extra.repeat_occurrences = null;
        }
    }

    return extra;
};

export const mapItemToDetachedUpdates = (item: TransactionModel) => ({
    id: item.id,
    repeat: null,
});

export const mergeItems = (items: TransactionModel[]) => {
    const [, ...rest] = items;

    if (!rest.length || uniqBy(items, 'money_location_id').length > 1) {
        return null;
    }

    return {
        categories: uniq(flatten(map(items, 'categories'))),
        favorite: Math.max(...map(items, 'favorite')),
        item: uniq(map(items, 'item')).join(', '),
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

export const useIncludePending = (): [boolean, (v: boolean) => void] => {
    const [value, setValue] = useQueryParamState(
        'includePending',
        'false' as string,
    );

    return [value === 'true', (nextValue) => setValue(String(nextValue))];
};

export const useInclude = () =>
    useQueryParamState<IncludeOption>('include', IncludeOption.all);
