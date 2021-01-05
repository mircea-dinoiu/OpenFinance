import {TransactionModel} from 'components/transactions/types';
import {IncludeOption} from 'defs';
import {QueryParam} from 'defs/url';
import {endOfDayToISOString} from 'js/utils/dates';
import {sumArray} from 'js/utils/numbers';
import {flatten, map, mapValues, sortBy, uniq, uniqBy} from 'lodash';
import moment from 'moment';
import {AccountStatus} from 'state/accounts';
import {Accounts} from 'types';
import {useQueryParamState} from 'utils/url';

export const mergeItems = (items: TransactionModel[]): Partial<TransactionModel> | null => {
    const [, ...rest] = items;

    if (!rest.length || uniqBy(items, 'money_location_id').length > 1 || uniqBy(items, 'price').length > 1) {
        return null;
    }

    return {
        categories: uniq(flatten(map(items, 'categories'))),
        favorite: Math.max(...map(items, 'favorite')),
        item: uniq(map(items, 'item')).join(', '),
        quantity: sumArray(map(items, 'quantity')),
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

export const sortMoneyLocations = (items: Accounts) =>
    sortBy(items, (item) => `${Object.values(AccountStatus).indexOf(item.status)}#${item.name}`);

export const useIncludePending = (): [boolean, (v: boolean) => void] => {
    const [value, setValue] = useQueryParamState(QueryParam.includePending, 'false' as string);

    return [value === 'true', (nextValue) => setValue(String(nextValue))];
};

export const useInclude = () => useQueryParamState<IncludeOption>(QueryParam.include, IncludeOption.all);

export const getEndDateBasedOnIncludePreference = (endDate: string, include: IncludeOption) => {
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
