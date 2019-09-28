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
      display: block;
      content: "${(props) => props.text}";
      font-size: 12px;
      padding: ${(props) => (props.text ? '0 5px' : 0)};
      flex: 1;
      text-align: center;
    }
`;

const PersonsDisplay = ({item}) => {
    const userList = useUser().list;

    return (
        <div
            css={css`
                display: flex;
                border-radius: 5px;
                overflow: hidden;
            `}
        >
            {userList
                .filter((user) => item.users[user.id])
                .map(({id, full_name: name, avatar}, index) => (
                    <Tooltip
                        tooltip={`${name} ${item.users[id]}%`}
                        css={css`
                            flex: ${item.users[id]};
                        `}
                    >
                        <PersonAvatar
                            key={id}
                            src={avatar}
                            text={index === 0 ? `${item.users[id]}%` : ''}
                        />
                    </Tooltip>
                ))}
        </div>
    );
};

export default PersonsDisplay;
