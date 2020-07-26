import {Flags} from 'components/transactions/MainScreenFlags';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import styled from 'styled-components';

const DescriptionDisplayStyled = styled.span`
    white-space: nowrap;
`;

export function DescriptionDisplay({
    item,
    accessor,
    entity,
}: {
    item: TransactionModel;
    accessor: keyof TransactionModel;
    entity: string;
}) {
    const flags = <Flags entity={entity} item={item} />;

    return (
        <DescriptionDisplayStyled>
            <span style={{float: 'left', marginRight: 5}}>{flags}</span>
            <span style={{float: 'left'}}>{item[accessor]}</span>
        </DescriptionDisplayStyled>
    );
}
