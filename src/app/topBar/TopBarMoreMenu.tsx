import {MoreVert as IconMoreVert, ExitToApp as IconExitToApp, List as IconList} from '@material-ui/icons';
import {Api} from 'app/Api';
import {useUsersWithActions} from 'users/state';
import React, {useState} from 'react';
import {IconButton, MenuItem, Menu, Checkbox, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {usePrivacyToggle} from 'privacyToggle/state';
import {CategoriesDialog} from 'categories/CategoriesDialog';
import {AccountsDialog} from 'accounts/AccountsDialog';
import {createXHR} from 'app/fetch';
import {TTopBarTab} from './TTopBarTab';
import {Link} from 'react-router-dom';
import {useIsDesktop} from '../useIsDesktop';
import {AppPasswordsDialog} from '../../appPasswords/AppPasswordsDialog';

export const TopBarMoreMenu = ({tabs}: {tabs: TTopBarTab[]}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const [categoriesIsOpen, setCategoriesIsOpen] = useState<boolean | null>(null);
    const [accountsIsOpen, setAccountsIsOpen] = useState<boolean | null>(null);
    const [appPasswordsIsOpen, setAppPasswordsIsOpen] = useState<boolean | null>(null);
    const isDesktop = useIsDesktop();

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
                <IconMoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={makeCloseHandler(() => {})}>
                {!isDesktop &&
                    tabs.map((tab) => (
                        <Link style={{color: 'inherit', textDecoration: 'none'}} key={tab.url} to={tab.url}>
                            <MenuItem>
                                <ListItemText primary={tab.label} />
                                <ListItemSecondaryAction>{tab.icon ?? <IconList />}</ListItemSecondaryAction>
                            </MenuItem>
                        </Link>
                    ))}

                <MenuItem onClick={makeCloseHandler(() => setCategoriesIsOpen(true))}>
                    <ListItemText primary="Categories" />
                    <ListItemSecondaryAction>
                        <IconList />
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem onClick={makeCloseHandler(() => setAccountsIsOpen(true))}>
                    <ListItemText primary="Accounts" />
                    <ListItemSecondaryAction>
                        <IconList />
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem onClick={makeCloseHandler(() => setAppPasswordsIsOpen(true))}>
                    <ListItemText primary="App Passwords" />
                    <ListItemSecondaryAction>
                        <IconList />
                    </ListItemSecondaryAction>
                </MenuItem>

                <MenuItem onClick={makeCloseHandler(() => setPrivacyToggle(!privacyToggle))}>
                    <ListItemText primary="Privacy Mode" />
                    <ListItemSecondaryAction>
                        <Checkbox color="primary" checked={privacyToggle} style={{padding: 0}} />
                    </ListItemSecondaryAction>
                </MenuItem>

                <Logout onClick={makeCloseHandler()} />
            </Menu>

            {categoriesIsOpen !== null && (
                <CategoriesDialog isOpen={categoriesIsOpen} onClose={() => setCategoriesIsOpen(false)} />
            )}
            {accountsIsOpen !== null && (
                <AccountsDialog isOpen={accountsIsOpen} onClose={() => setAccountsIsOpen(false)} />
            )}
            {appPasswordsIsOpen !== null && (
                <AppPasswordsDialog isOpen={appPasswordsIsOpen} onClose={() => setAppPasswordsIsOpen(false)} />
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
            <ListItemText primary="Logout" />
            <ListItemSecondaryAction>
                <IconExitToApp />
            </ListItemSecondaryAction>
        </MenuItem>
    );
};
