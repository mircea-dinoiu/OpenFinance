import {
    AppBar,
    Divider,
    Drawer,
    FormLabel,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem as MenuItem2,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import IconExitToApp from '@material-ui/icons/ExitToApp';
import IconMenu from '@material-ui/icons/Menu';
import IconRefresh from '@material-ui/icons/Refresh';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import {DatePicker} from '@material-ui/pickers';
import {CurrenciesDrawerContent} from 'components/currencies/CurrenciesDrawerContent';
import {MuiSelectNative} from 'components/dropdowns';
import {ShiftDateOption, ShiftDateOptions, Sizes} from 'defs';
import {spacingMedium, spacingSmall} from 'defs/styles';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useCurrencies} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';
import {useProjects, useSelectedProject} from 'state/projects';
import {
    shiftDateBack,
    shiftDateForward,
    useEndDate,
    useEndDateIncrement,
} from 'utils/dates';
import {mapUrlToFragment} from 'utils/url';
import {
    useBootstrap,
    useRefreshWidgetsDispatcher,
    useScreenSize,
} from '../../state/hooks';
import {ShiftMenu} from './ShiftMenu';

const INPUT_HEIGHT = `${parseInt(Sizes.HEADER_SIZE) - 4}px`;
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
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [
        shiftMenuAnchor,
        setShiftMenuAnchor,
    ] = React.useState<HTMLDivElement | null>(null);
    const refreshWidgets = useRefreshWidgetsDispatcher();
    const screenSize = useScreenSize();
    const user = useBootstrap();
    const history = useHistory();
    const currencies = useCurrencies();
    const [endDate, setEndDate] = useEndDate();
    const [endDateIncrement, setEndDateIncrement] = useEndDateIncrement();
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const isCurrenciesDrawerReady = () => user != null && currencies != null;

    const setDate = (date: Date) => {
        const url = new URL(window.location.href);

        url.searchParams.set('endDate', endOfDayToISOString(date));

        history.push(mapUrlToFragment(url));
    };

    const handleShiftBack = () => {
        setDate(shiftDateBack(endDate, endDateIncrement));
    };
    const handleShiftForward = () => {
        setDate(shiftDateForward(endDate, endDateIncrement));
    };
    const onClickRefresh = () => {
        refreshWidgets();
    };

    const renderEndDateIntervalSelect = () => (
        <div
            style={{
                marginRight: 12,
            }}
        >
            <MuiSelectNative<ShiftDateOption>
                value={ShiftDateOptions.find(
                    (o) => o.value === endDateIncrement,
                )}
                onChange={({value}) => {
                    setEndDateIncrement(value);
                }}
                options={ShiftDateOptions}
            />
        </div>
    );

    const handleCloseShiftMenu = () => {
        setShowShiftMenu(false);
    };

    const renderShiftBack = () => (
        <IconButton
            title={`Shift back ${ShiftDateOption[endDateIncrement]}`}
            onClick={handleShiftBack}
        >
            <IconArrowBack />
        </IconButton>
    );

    const renderShiftForward = () => (
        <IconButton
            style={{float: 'left', height: INPUT_HEIGHT}}
            title={`Shift forward ${ShiftDateOption[endDateIncrement]}`}
            onClick={handleShiftForward}
        >
            <IconArrowForward />
        </IconButton>
    );

    const renderShiftMenu = () => (
        <Menu
            open={showShiftMenu}
            anchorEl={shiftMenuAnchor}
            style={{marginTop: 29, marginLeft: -49}}
            onClose={handleCloseShiftMenu}
        >
            <ShiftMenu>
                <div>
                    <FormLabel component="legend">Previous</FormLabel>
                    {getShiftBackOptions(endDate, endDateIncrement).map(
                        (date) => {
                            const formattedDate = moment(date).format('ll');

                            return (
                                <MenuItem2
                                    key={formattedDate}
                                    onClick={() => {
                                        handleCloseShiftMenu();
                                        setDate(date);
                                    }}
                                >
                                    {formattedDate}
                                </MenuItem2>
                            );
                        },
                    )}
                </div>
                <div>
                    <FormLabel component="legend">Next</FormLabel>
                    {getShiftForwardOptions(endDate, endDateIncrement).map(
                        (date) => {
                            const formattedDate = moment(date).format('ll');

                            return (
                                <MenuItem2
                                    key={formattedDate}
                                    onClick={() => {
                                        handleCloseShiftMenu();
                                        setDate(date);
                                    }}
                                >
                                    {formattedDate}
                                </MenuItem2>
                            );
                        },
                    )}
                </div>
            </ShiftMenu>
        </Menu>
    );

    const isSmall = screenSize.isSmall;
    const projects = useProjects();
    const selectedProject = useSelectedProject();
    const cls = useStyles();

    const dateRange = user && (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto 1fr',
                alignItems: 'center',
                justifyItems: 'center',
            }}
        >
            {renderShiftBack()}
            <DatePicker
                variant="inline"
                style={{
                    width: '85px',
                }}
                format={'YYYY-MM-DD'}
                value={endDate ? moment(endDate).toDate() : null}
                onChange={(date) => {
                    setEndDate(endOfDayToISOString(date as any));
                }}
                onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    setShowShiftMenu(true);
                    setShiftMenuAnchor(event.currentTarget);
                }}
            />
            {renderShiftMenu()}
            {renderShiftForward()}
            {renderEndDateIntervalSelect()}
        </div>
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar className={cls.toolbar}>
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
                    {!isSmall && (
                        <Paper
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            {dateRange}
                        </Paper>
                    )}
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div style={{float: 'right', display: 'flex'}}>
                            {user && (
                                <IconButton
                                    onClick={() => setDrawerIsOpen(true)}
                                >
                                    <IconMenu htmlColor="white" />
                                </IconButton>
                            )}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerIsOpen}
                onClose={() => setDrawerIsOpen(false)}
            >
                <List>
                    {isSmall && (
                        <>
                            <ListItem disableGutters>{dateRange}</ListItem>
                            <Divider />
                        </>
                    )}
                    <ListItem
                        button
                        onClick={() => setPrivacyToggle(!privacyToggle)}
                    >
                        <ListItemIcon>
                            {privacyToggle ? (
                                <IconVisibilityOff />
                            ) : (
                                <IconVisibility />
                            )}
                        </ListItemIcon>
                        <ListItemText primary="Privacy Mode" />
                    </ListItem>
                    <ListItem button onClick={onClickRefresh}>
                        <ListItemIcon>
                            <IconRefresh />
                        </ListItemIcon>
                        <ListItemText primary="Reload" />
                    </ListItem>
                    <ListItem button onClick={props.onLogout}>
                        <ListItemIcon>
                            <IconExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                    <Divider />
                    {isCurrenciesDrawerReady() && (
                        <ListItem disableGutters>
                            <CurrenciesDrawerContent />
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </>
    );
};

const useStyles = makeStyles({
    toolbar: {
        backgroundColor: grey[900],
        paddingRight: spacingMedium,
    },
    paper: {
        padding: `${spacingSmall} ${spacingMedium}`,
    },
});
