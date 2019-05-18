// @flow
import React from 'react';
import { Flags } from 'mobile/ui/internal/common/MainScreenFlags';

export default function DescriptionDisplay({
    item,
    accessor = 'description',
    entity,
}) {
    const flags = <Flags entity={entity} item={item} />;

    return (
        <span className="noWrap">
            <span style={{ float: 'left', marginRight: 5 }}>{flags}</span>
            <span style={{ float: 'left' }}>{item[accessor]}</span>
        </span>
    );
}
