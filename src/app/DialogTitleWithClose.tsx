import {DialogTitle, IconButton, Dialog} from '@material-ui/core';
import IconClose from '@material-ui/icons/Close';
import React from 'react';
import {styled} from '@material-ui/core/styles';

export const DialogTitleWithClose = ({title, onClose}: {title: string; onClose: () => void}) => {
    return (
        <DialogTitle>
            <TitleGrid>
                <div>{title}</div>
                <IconButton onClick={onClose} edge={'end'}>
                    <IconClose />
                </IconButton>
            </TitleGrid>
        </DialogTitle>
    );
};

const TitleGrid = styled('div')((props) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridGap: props.theme.spacing(1),
    alignItems: 'center',
}));
