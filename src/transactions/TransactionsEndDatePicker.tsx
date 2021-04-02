import {
    FormLabel,
    IconButton,
    Menu,
    MenuItem as MenuItem2,
    MenuItem,
    Select,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import {DatePicker} from '@material-ui/pickers';
import {ShiftDateOption, ShiftDateOptions} from 'app/dates/defs';
import {ShiftMenu} from 'app/topBar/ShiftMenu';
import {getShiftBackOptions, getShiftForwardOptions} from 'app/topBar/TopBar';
import {useBootstrap} from 'users/state';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {shiftDateBack, shiftDateForward, useEndDate, useEndDateIncrement} from 'app/dates/helpers';
import {mapUrlToFragment} from 'app/url';

export const TransactionsEndDatePicker = () => {
    const history = useHistory();
    const [endDate, setEndDate] = useEndDate();
    const [endDateIncrement, setEndDateIncrement] = useEndDateIncrement();
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState<HTMLDivElement | null>(null);
    const user = useBootstrap();
    const cls = useStyles();

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

    const renderEndDateIntervalSelect = () => (
        <div
            style={{
                marginRight: 12,
            }}
        >
            <Select
                value={endDateIncrement}
                onChange={(e) => {
                    setEndDateIncrement(e.target.value as ShiftDateOption);
                }}
            >
                {ShiftDateOptions.map((sdo) => (
                    <MenuItem value={sdo.value}>{sdo.label}</MenuItem>
                ))}
            </Select>
        </div>
    );

    const handleCloseShiftMenu = () => {
        setShowShiftMenu(false);
    };

    const renderShiftBack = () => (
        <IconButton
            title={`Shift back ${ShiftDateOption[endDateIncrement]}`}
            onClick={handleShiftBack}
            className={cls.button}
        >
            <IconArrowBack />
        </IconButton>
    );

    const renderShiftForward = () => (
        <IconButton
            style={{float: 'left'}}
            title={`Shift forward ${ShiftDateOption[endDateIncrement]}`}
            onClick={handleShiftForward}
            className={cls.button}
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
            <div className={cls.root}>
                {renderShiftBack()}
                <DatePicker
                    variant="inline"
                    style={{
                        width: '85px',
                    }}
                    format={'L'}
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
        )
    );
};

const useStyles = makeStyles((theme) => ({
    button: {
        [theme.breakpoints.down('sm')]: {paddingTop: 0, paddingBottom: 0},
        [theme.breakpoints.only('md')]: {paddingTop: 0, paddingBottom: 0},
    },
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto 1fr',
        justifyItems: 'center',
        [theme.breakpoints.up('lg')]: {
            alignItems: 'center',
        },
    },
}));
