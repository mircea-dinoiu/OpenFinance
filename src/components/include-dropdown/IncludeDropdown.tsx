import {IncludeOption} from 'defs';
import * as React from 'react';
import {useEndDate} from 'utils/dates';
import {Select, MenuItem} from '@material-ui/core';

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

export const IncludeDropdown = ({
    onChange,
    value,
}: {
    value: IncludeOption;
    onChange: (value: IncludeOption) => void;
}) => {
    const [endDate] = useEndDate();
    const options = getIncludeOptions({endDate});

    return (
        <Select
            label="Include results"
            value={value}
            onChange={(e) => onChange(e.target.value as IncludeOption)}
            fullWidth={true}
        >
            {options.map((o) => (
                <MenuItem value={o.value}>{o.label}</MenuItem>
            ))}
        </Select>
    );
};
