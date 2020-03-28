import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import React from 'react';

export const SummaryExpander = ({
    isExpanded,
    onChange,
}: {
    isExpanded: boolean;
    onChange: (value: boolean) => unknown;
}) => {
    return (
        <IconButton color="inherit" onClick={() => onChange(!isExpanded)}>
            {isExpanded ? <UnfoldLess /> : <UnfoldMore />}
        </IconButton>
    );
};
