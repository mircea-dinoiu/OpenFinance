// @flow
import * as React from 'react';
import {Avatar} from '@material-ui/core';
import {useUser} from 'common/state';
import styled, {css} from 'styled-components';
import Tooltip from 'common/components/Tooltip';
import {grey} from '@material-ui/core/colors';

const PersonAvatar = styled(Avatar)`
    height: 20px !important;
    border-radius: 0 !important;
    width: 100% !important;
    background: ${grey[300]};
    justify-content: left !important;

    img {
        width: auto !important;
    }
    
    &:after {
      content: "${(props) => props.text}";
      font-size: 12px;
      padding: 0 2px;
    }
`;

const PersonsDisplay = ({item}) => {
    const userList = useUser().list;

    return (
        <div
            css={css`
                display: flex;
            `}
        >
            {userList.map(({id, full_name: name, avatar}) =>
                item.users[id] ? (
                    <Tooltip
                        tooltip={`${name} ${item.users[id]}%`}
                        css={css`
                            flex: ${item.users[id]};
                        `}
                    >
                        <PersonAvatar
                            key={id}
                            src={avatar}
                            text={item.users[id] + '%'}
                        />
                    </Tooltip>
                ) : null,
            )}
        </div>
    );
};

export default PersonsDisplay;
