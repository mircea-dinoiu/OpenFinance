import {makeStyles} from '@material-ui/core/styles';
import {Flags} from 'transactions/MainScreenFlags';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';

export function DescriptionDisplay({
    item,
    accessor,
    entity,
}: {
    item: TransactionModel;
    accessor: keyof TransactionModel;
    entity: string;
}) {
    const cls = useStyles();

    return (
        <div className={cls.grid}>
            <Flags entity={entity} item={item} />
            <span style={{flexGrow: 1}}>{item[accessor]}</span>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    grid: {
        display: 'flex',
        flexDirection: 'row',
        gridGap: theme.spacing(1),
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
}));
