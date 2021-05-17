import {CashAccount} from '../defs';
import React from 'react';
import {XGrid} from '@material-ui/x-grid';
import {NameColX, ValueColX} from '../columns';
import {useGridFooter} from '../makeTotalFooter';

export const LiquidGrid = ({rows, className}: {rows: CashAccount[]; className?: string}) => {
    const Footer = useGridFooter({
        rows,
        columns: [ValueColX],
    });

    return (
        <XGrid
            autoHeight={true}
            sortModel={[{field: 'total', sort: 'desc'}]}
            className={className}
            rows={rows}
            columns={[NameColX, ValueColX]}
            components={{
                Footer,
            }}
        />
    );
};
