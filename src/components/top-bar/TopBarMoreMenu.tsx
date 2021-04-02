import {MoreVert as MoreVertIcon} from '@material-ui/icons';
import {Api} from 'defs/Api';
import React, {useState} from 'react';
import {IconButton, MenuItem, Menu, Checkbox} from '@material-ui/core';
import {useUsersWithActions} from 'state/hooks';
import {usePrivacyToggle} from 'state/privacyToggle';
import {CategoriesDialog} from 'components/categories/CategoriesDialog';
import {AccountsDialog} from 'components/accounts/AccountsDialog';
import {createXHR} from 'utils/fetch';

export const TopBarMoreMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const [categoriesIsOpen, setCategoriesIsOpen] = useState<boolean | null>(null);
    const [accountsIsOpen, setAccountsIsOpen] = useState<boolean | null>(null);

    const makeCloseHandler = (fn?: () => void) => () => {
        fn?.();
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
                <Logout onClick={makeCloseHandler()} />
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

const Logout = ({onClick}: {onClick: () => void}) => {
    const [, {setUsers}] = useUsersWithActions();

    const handleLogout = async () => {
        try {
            await createXHR({url: Api.user.logout, method: 'POST'});

            setUsers(null);
        } catch (e) {
            window.location.reload();
        }
    };

    return (
        <MenuItem
            onClick={() => {
                handleLogout();
                onClick();
            }}
        >
            Logout
        </MenuItem>
    );
};
