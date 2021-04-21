import {Avatar} from '@material-ui/core';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {useSelectedProject} from 'projects/state';
import {styled} from '@material-ui/core/styles';
import {colors} from 'app/styles/colors';

export const PersonAvatar = styled(Avatar)({
    height: '20px !important',
    borderRadius: '0 !important',
    width: '100% !important',
    background: colors.personAvatarBg,
    justifyContent: 'left !important',
    '& img': {
        width: 'auto !important',
    },
    // @ts-ignore
    '&:after': {
        display: 'block',
        content: (props: {text: string}) => `"${props.text}"`,
        fontSize: '12px',
        padding: (props: {text: string}) => (props.text ? '0 5px' : 0),
        flex: 1,
        textAlign: 'center',
    },
});

const PersonsDisplayStyled = styled('div')({
    display: 'flex',
    borderRadius: '5px',
    overflow: 'hidden',
});

export const PersonsDisplay = ({item}: {item: TransactionModel}) => {
    const userList = useSelectedProject().users;

    return (
        <PersonsDisplayStyled>
            {userList
                .filter((user) => item.users[user.id])
                .map(({id, full_name: name, avatar}, index) => (
                    <div
                        key={index}
                        title={`${name} ${item.users[id]}%`}
                        style={{
                            flexGrow: index === 0 ? 1 : 'initial',
                        }}
                    >
                        <PersonAvatar key={id} src={avatar} text={index === 0 ? `${item.users[id]}%` : ''} />
                    </div>
                ))}
        </PersonsDisplayStyled>
    );
};
