import {Menu, MenuItem, Button, Divider, TextField, Typography} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {DatePicker} from '@material-ui/pickers';
import {ShiftDateOptions} from 'app/dates/defs';
import {shiftDateBack, shiftDateForward, useEndDate, endOfDayToISOString} from 'app/dates/helpers';
import {EndDatePickerMenuGrid, ShiftMenuToday, ShiftMenu} from 'app/topBar/ShiftMenu';
import moment from 'moment';
import * as React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useBootstrap} from 'users/state';
import {useIsDesktop} from '../app/useIsDesktop';

export const TransactionsEndDatePicker = () => {
    const history = useHistory();
    const location = useLocation();
    const [endDate, setEndDate] = useEndDate();
    const [shiftMenuAnchor, setShiftMenuAnchor] = React.useState<Element | null>(null);
    const user = useBootstrap();
    const isDesktop = useIsDesktop();

    const setDate = (date: Date) => {
        const searchParams = new URLSearchParams(location.search);

        searchParams.set('endDate', endOfDayToISOString(date));

        history.push({
            ...location,
            search: searchParams.toString(),
        });
    };

    const handleCloseShiftMenu = () => {
        setShiftMenuAnchor(null);
    };

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
    const datePickerValue = endDate ? moment(endDate).toDate() : null;

    return (
        user && (
            <>
                <Container>
                    <TextField
                        InputProps={{
                            readOnly: true,
                        }}
                        value={datePickerValue ? moment(datePickerValue).format('L') : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (shiftMenuAnchor) {
                                return;
                            }

                            setShiftMenuAnchor(e.currentTarget);
                        }}
                    />
                </Container>
                <Menu
                    open={!!shiftMenuAnchor}
                    anchorEl={shiftMenuAnchor}
                    onClose={handleCloseShiftMenu}
                    style={{
                        marginTop: '30px',
                    }}
                    MenuListProps={{
                        disablePadding: true,
                    }}
                >
                    <EndDatePickerMenuGrid>
                        <DatePicker
                            fullWidth={true}
                            variant="static"
                            format={'L'}
                            value={datePickerValue}
                            onChange={(date) => {
                                setEndDate(endOfDayToISOString(date as any));
                            }}
                        />
                        {isDesktop && (
                            <div>
                                <ShiftMenu>
                                    <div>
                                        <Typography variant="h6" align="center" paragraph={true}>
                                            Back
                                        </Typography>

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
                                        <Typography variant="h6" align="center" paragraph={true}>
                                            Forward
                                        </Typography>

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
                            </div>
                        )}
                    </EndDatePickerMenuGrid>
                </Menu>
            </>
        )
    );
};

const Container = styled('div')(({theme}) => ({
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    justifyItems: 'center',
    '& input': {
        textAlign: 'center',
    },
    [theme.breakpoints.up('lg')]: {
        alignItems: 'center',
    },
}));
