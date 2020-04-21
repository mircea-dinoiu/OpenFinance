import {IconButton, Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {useCopyTextWithConfirmation} from 'helpers/clipboardService';
import * as React from 'react';
import {usePreferences} from 'state/hooks';

export const Logged = ({onLogout}: {onLogout: () => unknown}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const preferences = usePreferences();
    const copyText = useCopyTextWithConfirmation();

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
                        handleClose();

                        const text = url.toString();

                        // using setTimeout because material ui is probably defocusing the textarea
                        setTimeout(() => copyText(text), 0);
                    }}
                >
                    Copy Deep-linkable URL
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
