// @flow
import {SingleSelect} from 'common/components/Select';
import type {
    TypePreferences,
    TypeScreenQueries,
    TypeShiftDateOption,
    TypeUser,
} from 'common/types';
import {objectEntriesOfSameType} from 'common/utils/collection';
import React, {PureComponent} from 'react';
import {Col, Row} from 'react-grid-system';
import {connect} from 'react-redux';
import {IconButton} from 'material-ui';
import {
    AppBar,
    Toolbar,
    Typography,
    Paper,
    Menu,
    MenuItem as MenuItem2,
    FormLabel,
} from '@material-ui/core';

import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Logged from 'mobile/ui/appBar/Logged';
import DateIcon from '@material-ui/icons/DateRange';
import {
    updateState,
    refreshWidgets,
    updatePreferences,
} from 'common/state/actions';
import {bindActionCreators} from 'redux';
import {shiftDateBack, shiftDateForward} from 'common/utils/dates';
import moment from 'moment';
import {ShiftDateOptions, Sizes} from 'common/defs';
import {DatePicker} from '@material-ui/pickers';
import {endOfDayToISOString} from 'shared/utils/dates';

type TypeProps = {
    onLogout: Function,
    title: string,
    showCurrenciesDrawer: boolean,
    actions: {
        updateState: typeof updateState,
        refreshWidgets: typeof refreshWidgets,
        updatePreferences: typeof updatePreferences,
    },
    screenSize: TypeScreenQueries,
    preferences: TypePreferences,
    user: TypeUser,
};

type TypeState = {
    showShiftMenu: boolean,
    showDateRange: boolean,
    shiftMenuAnchor: null | HTMLElement,
};

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

class TopBar extends PureComponent<TypeProps, TypeState> {
    state = {
        showDateRange: false,
        showShiftMenu: false,
        shiftMenuAnchor: null,
    };

    shiftBack(date) {
        this.props.actions.updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    }

    shiftForward(date) {
        this.props.actions.updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    }

    handleShiftBack = () => {
        this.shiftBack(
            shiftDateBack(
                this.props.preferences.endDate,
                this.props.preferences.endDateIncrement,
            ),
        );
    };
    handleShiftForward = () => {
        this.shiftForward(
            shiftDateForward(
                this.props.preferences.endDate,
                this.props.preferences.endDateIncrement,
            ),
        );
    };
    onChangeEndDate = (date) => {
        this.props.actions.updatePreferences({
            endDate: endOfDayToISOString(date),
        });
    };
    onClickRefresh = () => {
        this.props.actions.refreshWidgets();
    };
    onClickCurrenciesDrawerTrigger = () => {
        this.props.actions.updateState({currenciesDrawerOpen: true});
    };

    handleEndDateIntervalDropdownChange = (newValue) => {
        this.props.actions.updatePreferences({endDateIncrement: newValue});
    };

    handleToggleDateRange = () =>
        this.setState((state) => ({showDateRange: !state.showDateRange}));

    renderEndDateIntervalSelect() {
        return (
            <div
                style={{
                    float: 'left',
                    width: '120px',
                    marginRight: 12,
                    marginTop: 2,
                }}
            >
                <SingleSelect
                    value={this.props.preferences.endDateIncrement}
                    onChange={this.handleEndDateIntervalDropdownChange}
                    clearable={false}
                    options={objectEntriesOfSameType(ShiftDateOptions).map(
                        ([id, name]) => ({value: id, label: name}),
                    )}
                />
            </div>
        );
    }

    handleOpenShiftMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            showShiftMenu: true,
            shiftMenuAnchor: event.currentTarget,
        });
    };

    handleCloseShiftMenu = () => {
        this.setState({showShiftMenu: false});
    };

    renderShiftBack() {
        return (
            <IconButton
                style={{float: 'left', height: INPUT_HEIGHT}}
                tooltip={`Shift back ${
                    ShiftDateOptions[this.props.preferences.endDateIncrement]
                }`}
                onClick={this.handleShiftBack}
            >
                <ArrowBack />
            </IconButton>
        );
    }

    renderShiftForward() {
        return (
            <IconButton
                style={{float: 'left', height: INPUT_HEIGHT}}
                tooltip={`Shift forward ${
                    ShiftDateOptions[this.props.preferences.endDateIncrement]
                }`}
                onClick={this.handleShiftForward}
            >
                <ArrowForward />
            </IconButton>
        );
    }

    renderShiftMenu() {
        return (
            <Menu
                open={this.state.showShiftMenu}
                anchorEl={this.state.shiftMenuAnchor}
                style={{marginTop: 29, marginLeft: -49}}
                onClose={this.handleCloseShiftMenu}
            >
                <Row nogutter={true}>
                    <Col xs={6}>
                        <FormLabel
                            component="legend"
                            style={{textAlign: 'center'}}
                        >
                            Previous
                        </FormLabel>
                        {getShiftBackOptions(
                            this.props.preferences.endDate,
                            this.props.preferences.endDateIncrement,
                        ).map((date) => {
                            const formattedDate = moment(date).format('ll');

                            return (
                                <MenuItem2
                                    key={formattedDate}
                                    onClick={() => {
                                        this.handleCloseShiftMenu();
                                        this.shiftBack(date);
                                    }}
                                >
                                    {formattedDate}
                                </MenuItem2>
                            );
                        })}
                    </Col>
                    <Col xs={6}>
                        <FormLabel
                            component="legend"
                            style={{textAlign: 'center'}}
                        >
                            Next
                        </FormLabel>
                        {getShiftForwardOptions(
                            this.props.preferences.endDate,
                            this.props.preferences.endDateIncrement,
                        ).map((date) => {
                            const formattedDate = moment(date).format('ll');

                            return (
                                <MenuItem2
                                    key={formattedDate}
                                    onClick={() => {
                                        this.handleCloseShiftMenu();
                                        this.shiftForward(date);
                                    }}
                                >
                                    {formattedDate}
                                </MenuItem2>
                            );
                        })}
                    </Col>
                </Row>
            </Menu>
        );
    }

    render() {
        const isSmall = this.props.screenSize.isSmall;

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
                        {this.props.title}
                    </Typography>
                    {this.props.user && (
                        <Paper
                            style={{
                                height: INPUT_HEIGHT,
                                ...(isSmall
                                    ? {
                                          position: 'fixed',
                                          display: this.state.showDateRange
                                              ? 'block'
                                              : 'none',
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
                            {this.renderShiftBack()}
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
                                    this.props.preferences.endDate
                                        ? moment(
                                              this.props.preferences.endDate,
                                          ).toDate()
                                        : null
                                }
                                onChange={this.onChangeEndDate}
                                onContextMenu={this.handleOpenShiftMenu}
                            />
                            {this.renderShiftMenu()}
                            {this.renderShiftForward()}
                            {this.renderEndDateIntervalSelect()}
                        </Paper>
                    )}
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div style={{float: 'right'}}>
                            {this.props.user && isSmall && (
                                <IconButton
                                    onClick={this.handleToggleDateRange}
                                >
                                    <DateIcon htmlColor="white" />
                                </IconButton>
                            )}
                            {this.props.showCurrenciesDrawer && (
                                <IconButton
                                    onClick={
                                        this.onClickCurrenciesDrawerTrigger
                                    }
                                >
                                    <MonetizationOn htmlColor="white" />
                                </IconButton>
                            )}
                            {this.props.user && (
                                <IconButton onClick={this.onClickRefresh}>
                                    <Refresh htmlColor="white" />
                                </IconButton>
                            )}
                            {this.props.user && (
                                <Logged onLogout={this.props.onLogout} />
                            )}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(
    ({screen, screenSize, user, title, preferences}) => ({
        screen,
        screenSize,
        user,
        title,
        preferences,
    }),
    (dispatch) => ({
        actions: bindActionCreators(
            {
                updateState,
                refreshWidgets,
                updatePreferences,
            },
            dispatch,
        ),
    }),
)(TopBar);
