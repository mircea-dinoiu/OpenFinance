import {
    AppBar,
    FormLabel,
    IconButton,
    Menu,
    MenuItem as MenuItem2,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import IconDateIcon from '@material-ui/icons/DateRange';
import IconExitToApp from '@material-ui/icons/ExitToApp';

import IconMonetizationOn from '@material-ui/icons/MonetizationOn';
import IconRefresh from '@material-ui/icons/Refresh';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import {DatePicker} from '@material-ui/pickers';
import {MuiSelectNative} from 'components/dropdowns';
import {ShiftDateOption, ShiftDateOptions, Sizes} from 'defs';
import {mapUrlToFragment} from 'helpers';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
import React from 'react';
import {useHistory} from 'react-router-dom';
import {useCurrenciesDrawerOpenWithActions} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';
import {
    shiftDateBack,
    shiftDateForward,
    useEndDate,
    useEndDateIncrement,
} from 'utils/dates';
import {
    useRefreshWidgetsDispatcher,
    useScreenSize,
    useUsers,
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

export const TopBar = (props: {
    onLogout: () => void;
    showCurrenciesDrawer: boolean;
}) => {
    const [privacyToggle, setPrivacyToggle] = usePrivacyToggle();
    const [showDateRange, setShowDateRange] = React.useState(false);
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState(null);
    const refreshWidgets = useRefreshWidgetsDispatcher();
    const [, {setCurrenciesDrawerOpen}] = useCurrenciesDrawerOpenWithActions();
    const screenSize = useScreenSize();
    const user = useUsers();
    const history = useHistory();
    const [endDate, setEndDate] = useEndDate();
    const [endDateIncrement, setEndDateIncrement] = useEndDateIncrement();

    const setDate = (date) => {
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
    const onChangeEndDate = (date) => {
        setEndDate(endOfDayToISOString(date));
    };

    const onClickRefresh = () => {
        refreshWidgets();
    };

    const onClickCurrenciesDrawerTrigger = () => {
        setCurrenciesDrawerOpen(true);
    };

    const handleToggleDateRange = () => {
        setShowDateRange(!showDateRange);
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

    return (
        <AppBar position="sticky">
            <Toolbar
                style={{
                    paddingRight: 10,
                }}
            >
                <Typography variant="h6" color="inherit">
                    {document.title}
                </Typography>
                {user && (
                    <Paper
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto 1fr',
                            alignItems: 'center',
                            justifyItems: 'center',
                            ...(isSmall
                                ? {
                                      position: 'fixed',
                                      display: showDateRange ? 'block' : 'none',
                                      top: Sizes.HEADER_SIZE,
                                  }
                                : {
                                      position: 'absolute',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                  }),
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
                    <div style={{float: 'right', display: 'flex'}}>
                        {user && isSmall && (
                            <IconButton onClick={handleToggleDateRange}>
                                <IconDateIcon htmlColor="white" />
                            </IconButton>
                        )}
                        {props.showCurrenciesDrawer && (
                            <IconButton
                                onClick={onClickCurrenciesDrawerTrigger}
                            >
                                <IconMonetizationOn htmlColor="white" />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={() => setPrivacyToggle(!privacyToggle)}
                        >
                            {privacyToggle ? (
                                <IconVisibilityOff htmlColor="white" />
                            ) : (
                                <IconVisibility htmlColor="white" />
                            )}
                        </IconButton>
                        {user && (
                            <IconButton onClick={onClickRefresh}>
                                <IconRefresh htmlColor="white" />
                            </IconButton>
                        )}
                        {user && (
                            <IconButton onClick={props.onLogout}>
                                <IconExitToApp htmlColor="white" />
                            </IconButton>
                        )}
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};
