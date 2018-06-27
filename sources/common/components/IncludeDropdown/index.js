// @flow
import React from 'react';
import {MenuItem, SelectField} from 'material-ui';
import {IncludeOptions} from './defs';

const IncludeDropdown = ({onChange, value}) => (
    <SelectField
        floatingLabelText="Include results"
        floatingLabelFixed={true}
        value={value}
        onChange={(e, i, newValue) => onChange(newValue)}
        fullWidth={true}
        style={{margin: '-10px 0 0'}}
    >
        {IncludeOptions.map((option) => (
            <MenuItem
                key={option.id}
                value={option.id}
                primaryText={option.name}
            />
        ))}
    </SelectField>
);

export default IncludeDropdown;
