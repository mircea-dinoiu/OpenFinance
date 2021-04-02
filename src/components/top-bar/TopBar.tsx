import {AppBar, MenuItem, Select, Tab, Tabs, Toolbar, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconHome from '@material-ui/icons/Home';
import {TopBarMoreMenu} from 'components/top-bar/TopBarMoreMenu';
import {ShiftDateOption} from 'defs';
import {spacingNormal, stickyHeaderHeight} from 'defs/styles';
import {paths} from 'js/defs';
import {TabLink} from 'components/TabLink';
import _ from 'lodash';
import React from 'react';
import {generatePath, useLocation, useRouteMatch} from 'react-router-dom';
import {useProjects, useSelectedProject} from 'state/projects';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import {makeUrl} from 'utils/url';

const MAX_TIMES = 10;

export const getShiftBackOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (date: string, by: ShiftDateOption): Date[] =>
    new Array(MAX_TIMES).fill(null).map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = () => {
    const location = useLocation();
    const selectedProject = useSelectedProject();
    const match = useRouteMatch();
    const tabs = [paths.dashboard, paths.transactions];
    const projects = useProjects();
    const cls = useStyles();
    const searchParams = new URLSearchParams(location.search);
    const persistentSearchParams = _.pickBy(
        {
            endDate: searchParams.get('endDate'),
            endDateIncrement: searchParams.get('endDateIncrement'),
        },
        _.identity,
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar className={cls.toolbar} disableGutters={true}>
                    <Typography variant="h6" color="inherit">
                        {projects.length ? (
                            <Select
                                onChange={(e) => {
                                    window.location.href = generatePath(paths.dashboard, {
                                        id: String(e.target.value),
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
                    <div className={cls.tabs}>
                        <Tabs value={tabs.indexOf(match.path)}>
                            <TabLink
                                to={makeUrl(
                                    generatePath(tabs[0], {id: selectedProject.id}),
                                    persistentSearchParams,
                                )}
                            >
                                <Tab label={<IconHome />} />
                            </TabLink>
                            <TabLink
                                to={makeUrl(
                                    generatePath(tabs[1], {id: selectedProject.id}),
                                    persistentSearchParams,
                                )}
                            >
                                <Tab label="Transactions" />
                            </TabLink>
                        </Tabs>
                    </div>
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div style={{float: 'right', display: 'flex'}}>
                            <TopBarMoreMenu />
                        </div>
                    </div>
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
