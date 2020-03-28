import * as React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Menu, MenuItem, IconButton} from '@material-ui/core';
import {uniqueId} from 'lodash';
import {usePreferences} from 'state/hooks';

export const Logged = ({onLogout}: {onLogout: () => unknown}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const preferences = usePreferences();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? uniqueId('menu') : undefined;
    const url = new URL(window.location.href);

    url.search = new URLSearchParams(
        preferences as any,
    ).toString();

    return (
        <>
            <IconButton
                aria-controls={id}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon htmlColor="white" />
            </IconButton>
            <Menu id={id} anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => {
                    window.open(url.toString())
                }}>Share View</MenuItem>

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
