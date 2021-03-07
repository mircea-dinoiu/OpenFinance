import {AppBar, Tab, Tabs, Toolbar, Typography, Select, MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconHome from '@material-ui/icons/Home';
import {ShiftDateOption} from 'defs';
import {spacingNormal, stickyHeaderHeight} from 'defs/styles';
import {paths} from 'js/defs';
import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useProjects, useSelectedProject} from 'state/projects';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import {makeUrl} from 'utils/url';
import {useBootstrap} from '../../state/hooks';
import {TopBarMoreMenu} from 'components/top-bar/TopBarMoreMenu';
import _ from 'lodash';

const MAX_TIMES = 10;

export const getShiftBackOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = (props: {onLogout: () => void}) => {
    const user = useBootstrap();
    const history = useHistory();
    const location = useLocation();
    const tabs = [paths.dashboard, paths.transactions];
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
                                    window.location.href = makeUrl(paths.dashboard, {
                                        projectId: e.target.value,
                                    });
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
                    {user && (
                        <div className={cls.tabs}>
                            <Tabs
                                value={tabs.indexOf(location.pathname)}
                                onChange={(event, index) => {
                                    const url = new URL(window.location.href);

                                    history.push(
                                        makeUrl(
                                            tabs[index],
                                            _.pickBy(
                                                {
                                                    projectId: selectedProject.id,
                                                    endDate: url.searchParams.get('endDate'),
                                                    endDateIncrement: url.searchParams.get('endDateIncrement'),
                                                },
                                                _.identity,
                                            ),
                                        ),
                                    );
                                }}
                            >
                                <Tab label={<IconHome />} />
                                <Tab label="Transactions" />
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
                                <TopBarMoreMenu onLogout={props.onLogout} />
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
