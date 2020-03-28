import * as React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Menu, MenuItem, IconButton} from '@material-ui/core';
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
    const url = new URL(window.location.href);

    url.search = new URLSearchParams(preferences as any).toString();

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon htmlColor="white" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        window.open(url.toString());
                    }}
                >
                    Share View
                </MenuItem>

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
