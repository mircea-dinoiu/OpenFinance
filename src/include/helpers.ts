import {QueryParam} from 'app/QueryParam';
import {useQueryParamState} from 'app/url';
import {IncludeOption} from 'include/defs';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';

export const getEndDateBasedOnIncludePreference = (endDate: string, include: IncludeOption) => {
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
export const useInclude = () => useQueryParamState<IncludeOption>(QueryParam.include, IncludeOption.all);
export const useIncludePending = (): [boolean, (v: boolean) => void] => {
    const [value, setValue] = useQueryParamState(QueryParam.includePending, 'false' as string);

    return [value === 'true', (nextValue) => setValue(String(nextValue))];
};
