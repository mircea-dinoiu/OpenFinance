import {
    AppBar,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IconExitToApp from '@material-ui/icons/ExitToApp';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import {MuiSelectNative} from 'components/dropdowns';
import {ShiftDateOption} from 'defs';
import {spacingNormal, spacingSmall, stickyHeaderHeight} from 'defs/styles';
import {paths} from 'js/defs';
import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {usePrivacyToggle} from 'state/privacyToggle';
import {useProjects, useSelectedProject} from 'state/projects';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import {makeUrl, mapUrlToFragment} from 'utils/url';
import {useBootstrap, useScreenSize} from '../../state/hooks';

const MAX_TIMES = 10;

export const getShiftBackOptions = (
    date: string,
    by: ShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (
    date: string,
    by: ShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = (props: {onLogout: () => void}) => {
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const user = useBootstrap();
    const history = useHistory();
    const location = useLocation();
    const project = useSelectedProject();
    const tabs = [
        paths.transactions,
        paths.categories,
        paths.accounts,
        paths.accountTypes,
        paths.currencies,
    ];
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
                            <Paper className={cls.paper}>
                                <MuiSelectNative
                                    onChange={(o) => {
                                        const url = new URL(
                                            window.location.href,
                                        );

                                        url.searchParams.set(
                                            'projectId',
                                            o.value.toString(),
                                        );

                                        window.location.href = mapUrlToFragment(
                                            url,
                                        );
                                    }}
                                    options={projects.map((p) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))}
                                    value={{
                                        value: selectedProject.id,
                                    }}
                                    valueType="number"
                                />
                            </Paper>
                        ) : (
                            document.title
                        )}
                    </Typography>
                    {user && screenSize.isLarge && (
                        <Paper className={cls.tabs}>
                            <Tabs
                                value={tabs.indexOf(location.pathname)}
                                onChange={(event, index) => {
                                    history.push(
                                        makeUrl(tabs[index], {
                                            projectId: project.id,
                                        }),
                                    );
                                }}
                            >
                                <Tab label="Transactions" />
                                <Tab label="Categories" />
                                <Tab label="Accounts" />
                                <Tab label="Account Types" />
                                <Tab label="Currencies" />
                            </Tabs>
                        </Paper>
                    )}
                    {user && (
                        <div
                            style={{
                                flex: 1,
                            }}
                        >
                            <div style={{float: 'right', display: 'flex'}}>
                                <IconButton
                                    color="inherit"
                                    onClick={() =>
                                        setPrivacyToggle(!privacyToggle)
                                    }
                                >
                                    {privacyToggle ? (
                                        <IconVisibilityOff />
                                    ) : (
                                        <IconVisibility />
                                    )}
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    onClick={props.onLogout}
                                >
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
        backgroundColor: grey[900],
        paddingRight: spacingNormal,
        paddingLeft: spacingNormal,
        minHeight: stickyHeaderHeight,
    },
    paper: {
        padding: `${spacingSmall} ${spacingNormal}`,
    },
    tabs: {
        backgroundColor: 'transparent',
        color: grey[100],
        left: '50%',
        position: 'absolute',
        transform: 'translateX(-50%)',
    },
});
