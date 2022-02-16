import React from 'react';
import {GridColDef} from '@material-ui/x-grid';
import {Link} from '@material-ui/core';

export const renderUrlCell: GridColDef['renderCell'] = (params) => {
    const url = params.value as string;

    return url ? (
        <Link href={url} target="_blank" rel="noreferrer noopener">
            {url}
        </Link>
    ) : (
        <></>
    );
};
