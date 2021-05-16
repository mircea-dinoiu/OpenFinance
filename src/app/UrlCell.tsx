import React from 'react';
import {GridColDef} from '@material-ui/x-grid';

export const renderUrlCell: GridColDef['renderCell'] = (params) => {
    const url = params.value as string;

    return url ? (
        <a href={url} target="_blank" rel="noreferrer noopener">
            {url}
        </a>
    ) : (
        <></>
    );
};
