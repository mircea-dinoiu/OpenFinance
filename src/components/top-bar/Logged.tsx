import {IconButton, Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as React from 'react';

export const Logged = ({onLogout}: {onLogout: () => unknown}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon htmlColor="white" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
