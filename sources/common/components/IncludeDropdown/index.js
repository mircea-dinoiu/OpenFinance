// @flow
import * as React from 'react';
import {MenuItem, SelectField} from 'material-ui';
import {usePreferences} from 'common/state/hooks';

const getIncludeOptions = ({endDate}) => {
    const currentYear = new Date(endDate).getFullYear();

    return [
        {
            id: 'all',
            name: 'Everything',
        },
        {
            id: 'until-tmrw',
            name: 'Until tomorrow',
        },
        {
            id: 'ut',
            name: 'Until today',
        },
        {
            id: 'until-now',
            name: 'Until now',
        },
        {
            id: 'until-yd',
            name: 'Until yesterday',
        },
        {
            id: 'ld',
            name: '1 day before',
        },
        {
            id: 'lw',
            name: '1 week before',
        },
        {
            id: 'lm',
            name: '1 month before',
        },
        {
            id: 'ly',
            name: '1 year before',
        },
        {
            id: 'previous-year',
            name: `Throughout ${currentYear - 1}`,
        },
        {
            id: 'current-year',
            name: `Throughout ${currentYear}`,
        },
        {
            id: 'next-year',
            name: `Throughout ${currentYear + 1}`,
        },
    ];
};

const IncludeDropdown = ({onChange, value}) => {
    const {endDate} = usePreferences();

    return (
        <SelectField
            floatingLabelText="Include results"
            floatingLabelFixed={true}
            value={value}
            onChange={(e, i, newValue) => onChange(newValue)}
            fullWidth={true}
            style={{margin: '-10px 0 0'}}
        >
            {getIncludeOptions({endDate}).map((option) => (
                <MenuItem
                    key={option.id}
                    value={option.id}
                    primaryText={option.name}
                />
            ))}
        </SelectField>
    );
};

export default IncludeDropdown;
