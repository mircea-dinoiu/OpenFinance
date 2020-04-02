import {SingleSelect} from 'components/dropdowns';
import {IncludeOption} from 'defs';
import * as React from 'react';
import {usePreferences} from 'state/hooks';

const getIncludeOptions = ({endDate}: {endDate: string}) => {
    const currentYear = new Date(endDate).getFullYear();

    return [
        {
            value: IncludeOption.all,
            label: 'Everything',
        },
        {
            value: IncludeOption.untilTomorrow,
            label: 'Until tomorrow',
        },
        {
            value: IncludeOption.untilToday,
            label: 'Until today',
        },
        {
            value: IncludeOption.untilNow,
            label: 'Until now',
        },
        {
            value: IncludeOption.untilYesterday,
            label: 'Until yesterday',
        },
        {
            value: IncludeOption.lastDay,
            label: '1 day before',
        },
        {
            value: IncludeOption.lastWeek,
            label: '1 week before',
        },
        {
            value: IncludeOption.lastMonth,
            label: '1 month before',
        },
        {
            value: IncludeOption.lastYear,
            label: '1 year before',
        },
        {
            value: IncludeOption.previousYear,
            label: `Throughout ${currentYear - 1}`,
        },
        {
            value: IncludeOption.currentYear,
            label: `Throughout ${currentYear}`,
        },
        {
            value: IncludeOption.nextYear,
            label: `Throughout ${currentYear + 1}`,
        },
    ];
};

export const IncludeDropdown = ({onChange, value}) => {
    const {endDate} = usePreferences();
    const options = getIncludeOptions({endDate});

    return (
        <SingleSelect
            label="Include results"
            value={value}
            onChange={onChange}
            fullWidth={true}
            options={options}
        />
    );
};
