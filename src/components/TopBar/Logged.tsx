import * as React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {IconButton, IconMenu, MenuItem} from 'material-ui';

const Logged = (rawProps) => {
    const {onLogout, ...props} = rawProps;

    return (
        <IconMenu
            {...props}
            iconButtonElement={
                <IconButton>
                    <MoreVertIcon htmlColor="white" />
                </IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
            <MenuItem
                primaryText="Logout"
                onClick={onLogout}
            />
        </IconMenu>
    );
};

export default Logged;
