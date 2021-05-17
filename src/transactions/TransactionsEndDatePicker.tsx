import {FormLabel, IconButton, Menu, MenuItem as MenuItem2, MenuItem, Select, InputAdornment} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import {DatePicker} from '@material-ui/pickers';
import {ShiftDateOption, ShiftDateOptions} from 'app/dates/defs';
import {shiftDateBack, shiftDateForward, useEndDate, useEndDateIncrement, endOfDayToISOString} from 'app/dates/helpers';
import {ShiftMenu} from 'app/topBar/ShiftMenu';
import {getShiftBackOptions, getShiftForwardOptions} from 'app/topBar/TopBar';
import moment from 'moment';
import * as React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useBootstrap} from 'users/state';

export const TransactionsEndDatePicker = () => {
    const history = useHistory();
    const location = useLocation();
    const [endDate, setEndDate] = useEndDate();
    const [endDateIncrement, setEndDateIncrement] = useEndDateIncrement();
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState<HTMLDivElement | null>(null);
    const user = useBootstrap();
    const cls = useStyles();

    const setDate = (date: Date) => {
        const searchParams = new URLSearchParams(location.search);

        searchParams.set('endDate', endOfDayToISOString(date));

        history.push({
            ...location,
            search: searchParams.toString(),
        });
    };

    const renderEndDateIntervalSelect = () => (
        <Select
            fullWidth={true}
            value={endDateIncrement}
            onChange={(e) => {
                setEndDateIncrement(e.target.value as ShiftDateOption);
            }}
        >
            {ShiftDateOptions.map((sdo) => (
                <MenuItem key={sdo.value} value={sdo.value}>
                    {sdo.label}
                </MenuItem>
            ))}
        </Select>
    );

    const handleCloseShiftMenu = () => {
        setShowShiftMenu(false);
    };

    const renderShiftBack = () => (
        <IconButton
            size="small"
            title={`Shift back ${ShiftDateOption[endDateIncrement]}`}
            onClick={(e) => {
                e.stopPropagation();
                setDate(shiftDateBack(endDate, endDateIncrement));
            }}
            className={cls.button}
        >
            <IconArrowBack />
        </IconButton>
    );

    const renderShiftForward = () => (
        <IconButton
            size="small"
            title={`Shift forward ${ShiftDateOption[endDateIncrement]}`}
            onClick={(e) => {
                e.stopPropagation();
                setDate(shiftDateForward(endDate, endDateIncrement));
            }}
            className={cls.button}
        >
            <IconArrowForward />
        </IconButton>
    );

    const renderShiftMenu = () => (
        <Menu open={showShiftMenu} anchorEl={shiftMenuAnchor} onClose={handleCloseShiftMenu}>
            <ShiftMenu>
                <div>
                    <FormLabel component="legend">Previous</FormLabel>
                    {getShiftBackOptions(endDate, endDateIncrement).map((date) => {
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
                    })}
                </div>
                <div>
                    <FormLabel component="legend">Next</FormLabel>
                    {getShiftForwardOptions(endDate, endDateIncrement).map((date) => {
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
                    })}
                </div>
            </ShiftMenu>
        </Menu>
    );

    return (
        user && (
            <>
                <div className={cls.root}>
                    <DatePicker
                        fullWidth={true}
                        variant="inline"
                        format={'L'}
                        value={endDate ? moment(endDate).toDate() : null}
                        onChange={(date) => {
                            setEndDate(endOfDayToISOString(date as any));
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{renderShiftBack()}</InputAdornment>,
                            endAdornment: <InputAdornment position="start">{renderShiftForward()}</InputAdornment>,
                        }}
                        onContextMenu={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            setShowShiftMenu(true);
                            setShiftMenuAnchor(event.currentTarget);
                        }}
                    />

                    {renderEndDateIntervalSelect()}
                </div>
                {renderShiftMenu()}
            </>
        )
    );
};

const useStyles = makeStyles((theme) => ({
    button: {
        // [theme.breakpoints.down('sm')]: {paddingTop: 0, paddingBottom: 0},
        // [theme.breakpoints.only('md')]: {paddingTop: 0, paddingBottom: 0},
    },
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridGap: theme.spacing(1),
        justifyItems: 'center',
        [theme.breakpoints.up('lg')]: {
            alignItems: 'center',
        },
    },
}));
