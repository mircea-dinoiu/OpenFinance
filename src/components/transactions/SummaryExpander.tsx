import {IconButton} from '@material-ui/core';
import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
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
