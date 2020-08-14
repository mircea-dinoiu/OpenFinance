import {FormLabel, IconButton, Menu, MenuItem as MenuItem2} from '@material-ui/core';
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import {DatePicker} from '@material-ui/pickers';
import {MuiSelectNative} from 'components/dropdowns';
import {ShiftMenu} from 'components/top-bar/ShiftMenu';
import {getShiftBackOptions, getShiftForwardOptions} from 'components/top-bar/TopBar';
import {ShiftDateOption, ShiftDateOptions, Sizes} from 'defs';
import {endOfDayToISOString} from 'js/utils/dates';
import moment from 'moment';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {useBootstrap} from 'state/hooks';
import {shiftDateBack, shiftDateForward, useEndDate, useEndDateIncrement} from 'utils/dates';
import {mapUrlToFragment} from 'utils/url';

const INPUT_HEIGHT = `${parseInt(Sizes.HEADER_SIZE) - 4}px`;

export const TransactionsEndDatePicker = () => {
    const history = useHistory();
    const [endDate, setEndDate] = useEndDate();
    const [endDateIncrement, setEndDateIncrement] = useEndDateIncrement();
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [
        shiftMenuAnchor,
        setShiftMenuAnchor,
    ] = React.useState<HTMLDivElement | null>(null);
    const user = useBootstrap();

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

    return (
        user && (
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
        )
    );
};
