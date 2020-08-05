import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import React from 'react';

export const SummaryExpander = ({
    isExpanded,
}: {
    isExpanded: boolean;
}) => {
    return (
        <IconButton color="inherit">
            {isExpanded ? <UnfoldLess /> : <UnfoldMore />}
        </IconButton>
    );
};
