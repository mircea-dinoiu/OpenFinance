import {MenuItem, Select} from '@material-ui/core';
import {IncludeOption, IncludeOptions} from 'include/defs';
import * as React from 'react';

export const IncludeDropdown = ({
    onChange,
    value,
}: {
    value: IncludeOption;
    onChange: (value: IncludeOption) => void;
}) => {
    const options = IncludeOptions;

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
