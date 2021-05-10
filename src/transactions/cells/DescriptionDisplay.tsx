import {Flags} from 'transactions/MainScreenFlags';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {styled} from '@material-ui/core';

export function DescriptionDisplay({
    item,
    accessor,
    entity,
}: {
    item: TransactionModel;
    accessor: keyof TransactionModel;
    entity: string;
}) {
    return (
        <DescriptionDisplayStyled>
            <Flags entity={entity} item={item} />
            <span style={{flexGrow: 1}}>{item[accessor]}</span>
        </DescriptionDisplayStyled>
    );
}

const DescriptionDisplayStyled = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    gridGap: theme.spacing(0.5),
    alignItems: 'center',
    whiteSpace: 'nowrap',
}));
