import * as React from 'react';
import {usePreferences} from 'state/hooks';
import {SingleSelect} from 'components/Select';

const getIncludeOptions = ({endDate}) => {
    const currentYear = new Date(endDate).getFullYear();

    return [
        {
            value: 'all',
            label: 'Everything',
        },
        {
            value: 'until-tmrw',
            label: 'Until tomorrow',
        },
        {
            value: 'ut',
            label: 'Until today',
        },
        {
            value: 'until-now',
            label: 'Until now',
        },
        {
            value: 'until-yd',
            label: 'Until yesterday',
        },
        {
            value: 'ld',
            label: '1 day before',
        },
        {
            value: 'lw',
            label: '1 week before',
        },
        {
            value: 'lm',
            label: '1 month before',
        },
        {
            value: 'ly',
            label: '1 year before',
        },
        {
            value: 'previous-year',
            label: `Throughout ${currentYear - 1}`,
        },
        {
            value: 'current-year',
            label: `Throughout ${currentYear}`,
        },
        {
            value: 'next-year',
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
