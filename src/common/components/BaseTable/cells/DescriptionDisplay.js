// @ flow
import * as React from 'react';
import {Flags} from 'mobile/ui/internal/common/MainScreenFlags';
import {css} from 'styled-components';

export default function DescriptionDisplay({
    item,
    accessor = 'description',
    entity,
}) {
    const flags = <Flags entity={entity} item={item} />;

    return (
        <span
            css={css`
                white-space: nowrap;
            `}
        >
            <span style={{float: 'left', marginRight: 5}}>{flags}</span>
            <span style={{float: 'left'}}>{item[accessor]}</span>
        </span>
    );
}
