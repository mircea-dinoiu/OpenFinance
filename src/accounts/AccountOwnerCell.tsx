import {GridCellParams} from '@material-ui/x-grid';
import React from 'react';
import {Chip, Avatar} from '@material-ui/core';
import {useSelectedProject} from '../projects/state';
import {TAccount} from './defs';
import {styled} from '@material-ui/core/styles';

export const renderAccountOwnerCell = (params: GridCellParams) => {
    const id = params.value as number | null;

    return <AccountOwner id={id} />;
};

const AccountOwner = ({id}: {id: TAccount['owner_id']}) => {
    const {users} = useSelectedProject();
    const user = users.find((u) => u.id === id);

    if (user == null) {
        return <></>;
    }

    return <ChipStyled avatar={<Avatar src={user.avatar} />} label={user.full_name} />;
};

const ChipStyled = styled(Chip)({
    width: '100%',
});
