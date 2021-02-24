import {Avatar} from '@material-ui/core';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {useSelectedProject} from 'state/projects';
import styled from 'styled-components';
import {colors} from 'defs/styles';

export const PersonAvatar = styled(Avatar)`
    height: 20px !important;
    border-radius: 0 !important;
    width: 100% !important;
    background: ${colors.personAvatarBg};
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

const TooltipStyled = styled.div`
    flex-grow: ${(props: {index: number}) => (props.index === 0 ? 1 : 'initial')};
`;

export const PersonsDisplay = ({item}: {item: TransactionModel}) => {
    const userList = useSelectedProject().users;

    return (
        <PersonsDisplayStyled>
            {userList
                .filter((user) => item.users[user.id])
                .map(({id, full_name: name, avatar}, index) => (
                    <TooltipStyled key={index} title={`${name} ${item.users[id]}%`} index={index}>
                        <PersonAvatar key={id} src={avatar} text={index === 0 ? `${item.users[id]}%` : ''} />
                    </TooltipStyled>
                ))}
        </PersonsDisplayStyled>
    );
};
