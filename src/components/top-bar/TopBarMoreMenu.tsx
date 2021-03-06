import {MoreVert as MoreVertIcon} from '@material-ui/icons';
import React, {useState} from 'react';
import {IconButton, MenuItem, Menu, Checkbox} from '@material-ui/core';
import {usePrivacyToggle} from 'state/privacyToggle';
import {CategoriesDialog} from 'components/categories/CategoriesDialog';
import {AccountsDialog} from 'components/accounts/AccountsDialog';

export const TopBarMoreMenu = ({onLogout}: {onLogout: () => void}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const [categoriesIsOpen, setCategoriesIsOpen] = useState<boolean | null>(null);
    const [accountsIsOpen, setAccountsIsOpen] = useState<boolean | null>(null);

    const makeCloseHandler = (fn: () => void) => () => {
        fn();
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={makeCloseHandler(() => {})}>
                <MenuItem onClick={makeCloseHandler(() => setPrivacyToggle(!privacyToggle))}>
                    Privacy Mode <Checkbox color="primary" checked={privacyToggle} />
                </MenuItem>
                <MenuItem onClick={makeCloseHandler(() => setCategoriesIsOpen(true))}>Manage Categories</MenuItem>
                <MenuItem onClick={makeCloseHandler(() => setAccountsIsOpen(true))}>Manage Accounts</MenuItem>
                <MenuItem onClick={makeCloseHandler(onLogout)}>Logout</MenuItem>
            </Menu>

            {categoriesIsOpen !== null && (
                <CategoriesDialog isOpen={categoriesIsOpen} onClose={() => setCategoriesIsOpen(false)} />
            )}
            {accountsIsOpen !== null && (
                <AccountsDialog isOpen={accountsIsOpen} onClose={() => setAccountsIsOpen(false)} />
            )}
        </div>
    );
};
