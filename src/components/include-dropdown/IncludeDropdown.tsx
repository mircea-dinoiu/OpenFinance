import {MenuItem, Select} from '@material-ui/core';
import {IncludeOption} from 'defs';
import * as React from 'react';

const getIncludeOptions = () => {
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
            value: IncludeOption.weekToDate,
            label: 'Week to Date',
        },
        {
            value: IncludeOption.monthToDate,
            label: 'Month to Date',
        },
        {
            value: IncludeOption.yearToDate,
            label: 'Year to Date',
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
    const options = getIncludeOptions();

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
