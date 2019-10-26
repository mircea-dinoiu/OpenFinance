import {SingleSelect} from 'components/Select';
import {TypeShiftDateOption} from 'types';
import {objectEntriesOfSameType} from 'utils/collection';
import React from 'react';
import {IconButton} from 'material-ui';
import {
    AppBar,
    FormLabel,
    Menu,
    MenuItem as MenuItem2,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';

import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import {Logged} from './Logged';
import DateIcon from '@material-ui/icons/DateRange';
import {shiftDateBack, shiftDateForward} from 'utils/dates';
import moment from 'moment';
import {ShiftDateOptions, Sizes} from 'defs';
import {DatePicker} from '@material-ui/pickers';
import {endOfDayToISOString} from 'js/utils/dates';
import {ShiftMenu} from './ShiftMenu';
import {
    useCurrenciesDrawerOpenWithSetter,
    usePreferencesWithActions,
    useRefreshWidgetsDispatcher,
    useScreenSize,
    useTitle,
    useUsers,
} from '../../state/hooks';

const INPUT_HEIGHT = `${parseInt(Sizes.HEADER_SIZE) - 4}px`;
const MAX_TIMES = 10;

export const getShiftBackOptions = (
    date: string,
    by: TypeShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (
    date: string,
    by: TypeShiftDateOption,
): Date[] =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateForward(date, by, index + 1));

export const TopBar = (props: {
    onLogout: () => void;
    showCurrenciesDrawer: boolean;
}) => {
    const [showDateRange, setShowDateRange] = React.useState(false);
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState(null);
    const [preferences, {updatePreferences}] = usePreferencesWithActions();
    const refreshWidgets = useRefreshWidgetsDispatcher();
    const [, setCurrenciesDrawerOpen] = useCurrenciesDrawerOpenWithSetter();
    const screenSize = useScreenSize();
    const user = useUsers();
    const title = useTitle();

    const shiftBack = (date) => {
        updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    };

    const shiftForward = (date) => {
        updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    };

    const handleShiftBack = () => {
        shiftBack(
            shiftDateBack(preferences.endDate, preferences.endDateIncrement),
        );
    };
    const handleShiftForward = () => {
        shiftForward(
            shiftDateForward(preferences.endDate, preferences.endDateIncrement),
        );
    };
    const onChangeEndDate = (date) => {
        updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    };

    const onClickRefresh = () => {
        refreshWidgets();
    };

    const onClickCurrenciesDrawerTrigger = () => {
        setCurrenciesDrawerOpen(true);
    };

    const handleEndDateIntervalDropdownChange = (newValue) => {
        updatePreferences({endDateIncrement: newValue});
    };

    const handleToggleDateRange = () => {
        setShowDateRange(!showDateRange);
    };

    const renderEndDateIntervalSelect = () => (
        <div
            style={{
                float: 'left',
                width: '120px',
                marginRight: 12,
                marginTop: 2,
            }}
        >
            <SingleSelect
                value={preferences.endDateIncrement}
                onChange={handleEndDateIntervalDropdownChange}
                clearable={false}
                options={objectEntriesOfSameType(ShiftDateOptions).map(
                    ([id, name]) => ({value: id, label: name}),
                )}
            />
        </div>
    );

    const handleOpenShiftMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setShowShiftMenu(true);
        setShiftMenuAnchor(event.currentTarget);
    };

    const handleCloseShiftMenu = () => {
        setShowShiftMenu(false);
    };

    const renderShiftBack = () => (
        <IconButton
            style={{float: 'left', height: INPUT_HEIGHT}}
            tooltip={`Shift back ${
                ShiftDateOptions[preferences.endDateIncrement]
            }`}
            onClick={handleShiftBack}
        >
            <ArrowBack />
        </IconButton>
    );

    const renderShiftForward = () => (
        <IconButton
            style={{float: 'left', height: INPUT_HEIGHT}}
            tooltip={`Shift forward ${
                ShiftDateOptions[preferences.endDateIncrement]
            }`}
            onClick={handleShiftForward}
        >
            <ArrowForward />
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
                    {getShiftBackOptions(
                        preferences.endDate,
                        preferences.endDateIncrement,
                    ).map((date) => {
                        const formattedDate = moment(date).format('ll');

                        return (
                            <MenuItem2
                                key={formattedDate}
                                onClick={() => {
                                    handleCloseShiftMenu();
                                    shiftBack(date);
                                }}
                            >
                                {formattedDate}
                            </MenuItem2>
                        );
                    })}
                </div>
                <div>
                    <FormLabel component="legend">Next</FormLabel>
                    {getShiftForwardOptions(
                        preferences.endDate,
                        preferences.endDateIncrement,
                    ).map((date) => {
                        const formattedDate = moment(date).format('ll');

                        return (
                            <MenuItem2
                                key={formattedDate}
                                onClick={() => {
                                    handleCloseShiftMenu();
                                    shiftForward(date);
                                }}
                            >
                                {formattedDate}
                            </MenuItem2>
                        );
                    })}
                </div>
            </ShiftMenu>
        </Menu>
    );

    const isSmall = screenSize.isSmall;

    return (
        <AppBar
            position="fixed"
            style={{
                height: Sizes.HEADER_SIZE,
            }}
        >
            <Toolbar
                style={{
                    height: Sizes.HEADER_SIZE,
                    minHeight: 'auto',
                    paddingRight: 10,
                }}
            >
                <Typography variant="h6" color="inherit">
                    {title}
                </Typography>
                {user && (
                    <Paper
                        style={{
                            height: INPUT_HEIGHT,
                            ...(isSmall
                                ? {
                                      position: 'fixed',
                                      display: showDateRange ? 'block' : 'none',
                                      top: Sizes.HEADER_SIZE,
                                  }
                                : {
                                      position: 'absolute',
                                      left: '50%',
                                      top: '1px',
                                      transform: 'translateX(-50%)',
                                  }),
                        }}
                    >
                        {renderShiftBack()}
                        <DatePicker
                            variant="inline"
                            style={{
                                float: 'left',
                                textAlign: 'center',
                                width: '85px',
                                marginTop: 5,
                            }}
                            format={'YYYY-MM-DD'}
                            value={
                                preferences.endDate
                                    ? moment(preferences.endDate).toDate()
                                    : null
                            }
                            onChange={onChangeEndDate}
                            onContextMenu={handleOpenShiftMenu}
                        />
                        {renderShiftMenu()}
                        {renderShiftForward()}
                        {renderEndDateIntervalSelect()}
                    </Paper>
                )}
                <div
                    style={{
                        flex: 1,
                    }}
                >
                    <div style={{float: 'right'}}>
                        {user && isSmall && (
                            <IconButton onClick={handleToggleDateRange}>
                                <DateIcon htmlColor="white" />
                            </IconButton>
                        )}
                        {props.showCurrenciesDrawer && (
                            <IconButton
                                onClick={onClickCurrenciesDrawerTrigger}
                            >
                                <MonetizationOn htmlColor="white" />
                            </IconButton>
                        )}
                        {user && (
                            <IconButton onClick={onClickRefresh}>
                                <Refresh htmlColor="white" />
                            </IconButton>
                        )}
                        {user && <Logged onLogout={props.onLogout} />}
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};
