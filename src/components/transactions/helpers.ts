import {IncludeOption} from 'defs';
import {QueryParam} from 'defs/url';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
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

export const mapItemToDetachedUpdates = (
    item: TransactionModel,
): Partial<TransactionModel> => ({
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
        QueryParam.includePending,
        'false' as string,
    );

    return [value === 'true', (nextValue) => setValue(String(nextValue))];
};

export const useInclude = () =>
    useQueryParamState<IncludeOption>(QueryParam.include, IncludeOption.all);

export const getEndDateBasedOnIncludePreference = (
    endDate,
    include: IncludeOption,
) => {
    if (include === IncludeOption.previousYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.nextYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(2, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.currentYear) {
        return endOfDayToISOString(
            moment(endDate)
                .month(0)
                .date(1)
                .add(1, 'year')
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilToday) {
        return endOfDayToISOString();
    }

    if (include === IncludeOption.untilTomorrow) {
        return endOfDayToISOString(
            moment()
                .add(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilYesterday) {
        return endOfDayToISOString(
            moment()
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilNow) {
        return moment().toISOString();
    }

    return endDate;
};
