import * as React from 'react';
import {Avatar} from '@material-ui/core';
import styled from 'styled-components';
import {Tooltip} from 'components/Tooltip';
import {grey} from '@material-ui/core/colors';
import {useUsers} from 'state/hooks';

export const PersonAvatar = styled(Avatar)`
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
      content: "${(props: {text: string}) => props.text}";
      font-size: 12px;
      padding: ${(props) => (props.text ? '0 5px' : 0)};
      flex: 1;
      text-align: center;
    }
`;

const PersonsDisplayStyled = styled.div`
    display: flex;
    border-radius: 5px;
    overflow: hidden;
`;

const TooltipStyled = styled(Tooltip)`
    flex-grow: ${(props: {index: number}) =>
        props.index === 0 ? 1 : 'initial'};
`;

export const PersonsDisplay = ({item}) => {
    const userList = useUsers().list;

    return (
        <PersonsDisplayStyled>
            {userList
                .filter((user) => item.users[user.id])
                .map(({id, full_name: name, avatar}, index) => (
                    <TooltipStyled
                        key={index}
                        tooltip={`${name} ${item.users[id]}%`}
                        index={index}
                    >
                        <PersonAvatar
                            key={id}
                            src={avatar}
                            text={index === 0 ? `${item.users[id]}%` : ''}
                        />
                    </TooltipStyled>
                ))}
        </PersonsDisplayStyled>
    );
};
