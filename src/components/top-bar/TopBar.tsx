import {AppBar, IconButton, Tab, Tabs, Toolbar, Typography, Select, MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconExitToApp from '@material-ui/icons/ExitToApp';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import IconHome from '@material-ui/icons/Home';
import {ShiftDateOption} from 'defs';
import {spacingNormal, stickyHeaderHeight} from 'defs/styles';
import {paths} from 'js/defs';
import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {usePrivacyToggle} from 'state/privacyToggle';
import {useProjects, useSelectedProject} from 'state/projects';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import {makeUrl, mapUrlToFragment} from 'utils/url';
import {useBootstrap, useScreenSize} from '../../state/hooks';

const MAX_TIMES = 10;

export const getShiftBackOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = (props: {onLogout: () => void}) => {
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const user = useBootstrap();
    const history = useHistory();
    const location = useLocation();
    const tabs = [paths.dashboard, paths.transactions, paths.categories, paths.accounts];
    const screenSize = useScreenSize();
    const projects = useProjects();
    const selectedProject = useSelectedProject();
    const cls = useStyles();

    return (
        <>
            <AppBar position="sticky">
                <Toolbar className={cls.toolbar} disableGutters={true}>
                    <Typography variant="h6" color="inherit">
                        {projects.length ? (
                            <Select
                                onChange={(e) => {
                                    const url = new URL(window.location.href);

                                    url.searchParams.set('projectId', e.target.value as string);

                                    window.location.href = mapUrlToFragment(url);
                                }}
                                value={selectedProject.id}
                            >
                                {projects.map((p) => (
                                    <MenuItem value={p.id}>{p.name}</MenuItem>
                                ))}
                            </Select>
                        ) : (
                            document.title
                        )}
                    </Typography>
                    {user && screenSize.isLarge && (
                        <div className={cls.tabs}>
                            <Tabs
                                value={tabs.indexOf(location.pathname)}
                                onChange={(event, index) => {
                                    history.push(
                                        makeUrl(tabs[index], Object.fromEntries(new URLSearchParams(location.search))),
                                    );
                                }}
                            >
                                <Tab label={<IconHome />} />
                                <Tab label="Transactions" />
                                <Tab label="Categories" />
                                <Tab label="Accounts" />
                            </Tabs>
                        </div>
                    )}
                    {user && (
                        <div
                            style={{
                                flex: 1,
                            }}
                        >
                            <div style={{float: 'right', display: 'flex'}}>
                                <IconButton color="inherit" onClick={() => setPrivacyToggle(!privacyToggle)}>
                                    {privacyToggle ? <IconVisibilityOff /> : <IconVisibility />}
                                </IconButton>
                                <IconButton color="inherit" onClick={props.onLogout}>
                                    <IconExitToApp />
                                </IconButton>
                            </div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

const useStyles = makeStyles({
    toolbar: {
        paddingRight: spacingNormal,
        paddingLeft: spacingNormal,
        minHeight: stickyHeaderHeight,
    },
    tabs: {
        backgroundColor: 'transparent',
        left: '50%',
        position: 'absolute',
        transform: 'translateX(-50%)',
    },
});
