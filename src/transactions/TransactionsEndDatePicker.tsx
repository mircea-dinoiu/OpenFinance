import {FormLabel, IconButton, Menu, MenuItem, InputAdornment, Button, Divider} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {DatePicker} from '@material-ui/pickers';
import {ShiftDateOptions} from 'app/dates/defs';
import {shiftDateBack, shiftDateForward, useEndDate, endOfDayToISOString} from 'app/dates/helpers';
import {ShiftMenu, ShiftMenuToday} from 'app/topBar/ShiftMenu';
import moment from 'moment';
import * as React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useBootstrap} from 'users/state';
import {MoreVert as IconMoreVert} from '@material-ui/icons';

export const TransactionsEndDatePicker = () => {
    const history = useHistory();
    const location = useLocation();
    const [endDate, setEndDate] = useEndDate();
    const [showShiftMenu, setShowShiftMenu] = React.useState(false);
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState<Element | null>(null);
    const user = useBootstrap();

    const setDate = (date: Date) => {
        const searchParams = new URLSearchParams(location.search);

        searchParams.set('endDate', endOfDayToISOString(date));

        history.push({
            ...location,
            search: searchParams.toString(),
        });
    };

    const handleCloseShiftMenu = () => {
        setShowShiftMenu(false);
    };

    const renderShiftMenu = () => (
        <Menu open={showShiftMenu} anchorEl={shiftMenuAnchor} onClose={handleCloseShiftMenu}>
            <ShiftMenu>
                <div>
                    <FormLabel component="legend">Back</FormLabel>
                    {renderMenuItem({
                        label: 'Month Start',
                        getDate: () =>
                            moment(endDate)
                                .set({
                                    date: 1,
                                })
                                .toDate(),
                    })}
                    {renderMenuItem({
                        label: 'Year Start',
                        getDate: () =>
                            moment(endDate)
                                .set({
                                    date: 1,
                                    month: 0,
                                })
                                .toDate(),
                    })}
                    {ShiftDateOptions.map((sdo) =>
                        renderMenuItem({
                            label: `-${sdo.label}`,
                            getDate: () => shiftDateBack(endDate, sdo.value),
                        }),
                    )}
                </div>
                <div>
                    <FormLabel component="legend">Forward</FormLabel>
                    {renderMenuItem({
                        label: 'Month End',
                        getDate: () => {
                            const m = moment(endDate);

                            return m
                                .set({
                                    date: 0,
                                    months: m.month() + 1,
                                })
                                .toDate();
                        },
                    })}
                    {renderMenuItem({
                        label: 'Year End',
                        getDate: () =>
                            moment(endDate)
                                .set({
                                    date: 31,
                                    months: 11,
                                })
                                .toDate(),
                    })}
                    {ShiftDateOptions.map((sdo) =>
                        renderMenuItem({
                            label: `+${sdo.label}`,
                            getDate: () => shiftDateForward(endDate, sdo.value),
                        }),
                    )}
                </div>
            </ShiftMenu>
            <Divider />
            <ShiftMenuToday>
                <Button fullWidth={true} variant="outlined" onClick={() => setDate(new Date())}>
                    Today
                </Button>
            </ShiftMenuToday>
        </Menu>
    );

    const renderMenuItem = ({label, getDate}: {label: string; getDate: () => Date}) => {
        return (
            <MenuItem
                onClick={(e) => {
                    e.stopPropagation();

                    setDate(getDate());
                }}
            >
                {label}
            </MenuItem>
        );
    };

    return (
        user && (
            <>
                <Container>
                    <DatePicker
                        fullWidth={true}
                        variant="inline"
                        format={'L'}
                        value={endDate ? moment(endDate).toDate() : null}
                        onChange={(date) => {
                            setEndDate(endOfDayToISOString(date as any));
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setShowShiftMenu(true);
                                            setShiftMenuAnchor(e.currentTarget);
                                        }}
                                    >
                                        <IconMoreVert />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onContextMenu={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            setShowShiftMenu(true);
                            setShiftMenuAnchor(event.currentTarget);
                        }}
                    />
                </Container>
                {renderShiftMenu()}
            </>
        )
    );
};

const Container = styled('div')(({theme}) => ({
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    justifyItems: 'center',
    [theme.breakpoints.up('lg')]: {
        alignItems: 'center',
    },
}));
