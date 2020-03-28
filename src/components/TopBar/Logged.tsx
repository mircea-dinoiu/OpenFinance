import * as React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Menu, MenuItem, IconButton} from '@material-ui/core';
import {uniqueId} from 'lodash';

export const Logged = ({onLogout}: {onLogout: () => unknown}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? uniqueId('menu') : undefined;

    return (
        <>
            <IconButton
                aria-controls={id}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon htmlColor="white" />
            </IconButton>
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onLogout();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};
