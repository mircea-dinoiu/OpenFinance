// @flow
import React, { PureComponent } from 'react';
import { Col, Row } from 'react-grid-system';
import { connect } from 'react-redux';
import { DatePicker, IconButton, MenuItem, SelectField } from 'material-ui';
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
import { bindActionCreators } from 'redux';
import { formatYMD, shiftDateBack, shiftDateForward } from 'common/utils/dates';
import moment from 'moment';
import { ShiftDateOptions, Sizes } from 'common/defs';

type TypeProps = {
    onLogout: Function,
    title: string,
    showCurrenciesDrawer: boolean,
    actions: {
        updateState: typeof updateState,
        refreshWidgets: typeof refreshWidgets,
    },
};

type TypeState = {};

const INPUT_HEIGHT = `${parseInt(Sizes.HEADER_SIZE) - 4}px`;
const MAX_TIMES = 10;

export const getShiftBackOptions = (date, by) =>
    new Array(MAX_TIMES)
        .fill(null)
        .map((each, index) => shiftDateBack(date, by, index + 1));

export const getShiftForwardOptions = (date, by) =>
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
            endDate: formatYMD(date),
        });
    }

    shiftForward(date) {
        this.props.actions.updatePreferences({
            endDate: formatYMD(date),
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
    onChangeEndDate = (nothing, date) => {
        this.props.actions.updatePreferences({ endDate: formatYMD(date) });
    };
    onClickRefresh = () => {
        this.props.actions.refreshWidgets();
    };
    onClickCurrenciesDrawerTrigger = () => {
        this.props.actions.updateState({ currenciesDrawerOpen: true });
    };

    handleEndDateIntervalDropdownChange = (e, i, newValue) => {
        this.props.actions.updatePreferences({ endDateIncrement: newValue });
    };

    handleToggleDateRange = () =>
        this.setState((state) => ({ showDateRange: !state.showDateRange }));

    renderEndDateIntervalSelect() {
        return (
            <SelectField
                value={this.props.preferences.endDateIncrement}
                onChange={this.handleEndDateIntervalDropdownChange}
                style={{
                    width: '120px',
                    height: INPUT_HEIGHT,
                }}
            >
                {Object.entries(ShiftDateOptions).map(([id, name]) => (
                    <MenuItem key={id} value={id} primaryText={name} />
                ))}
            </SelectField>
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
        this.setState({ showShiftMenu: false });
    };

    renderShiftBack() {
        return (
            <IconButton
                style={{ float: 'left', height: INPUT_HEIGHT }}
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
                style={{ float: 'left', height: INPUT_HEIGHT }}
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
                style={{ marginTop: 29, marginLeft: -49 }}
                onClose={this.handleCloseShiftMenu}
            >
                <Row nogutter={true} style={{ outline: 'none' }}>
                    <Col xs={6}>
                        <FormLabel
                            component="legend"
                            style={{ textAlign: 'center' }}
                        >
                            Previous
                        </FormLabel>
                        {getShiftBackOptions(
                            this.props.preferences.endDate,
                            this.props.preferences.endDateIncrement,
                        ).map((date) => {
                            const dateAsYMD = formatYMD(date);

                            return (
                                <MenuItem2
                                    key={dateAsYMD}
                                    onClick={() => {
                                        this.handleCloseShiftMenu();
                                        this.shiftBack(date);
                                    }}
                                >
                                    {dateAsYMD}
                                </MenuItem2>
                            );
                        })}
                    </Col>
                    <Col xs={6}>
                        <FormLabel
                            component="legend"
                            style={{ textAlign: 'center' }}
                        >
                            Next
                        </FormLabel>
                        {getShiftForwardOptions(
                            this.props.preferences.endDate,
                            this.props.preferences.endDateIncrement,
                        ).map((date) => {
                            const dateAsYMD = formatYMD(date);

                            return (
                                <MenuItem2
                                    key={dateAsYMD}
                                    onClick={() => {
                                        this.handleCloseShiftMenu();
                                        this.shiftForward(date);
                                    }}
                                >
                                    {dateAsYMD}
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
                    <Typography variant="title" color="inherit">
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
                                style={{ float: 'left' }}
                                textFieldStyle={{
                                    textAlign: 'center',
                                    width: '85px',
                                    height: INPUT_HEIGHT,
                                }}
                                hintText=""
                                value={
                                    this.props.preferences.endDate
                                        ? moment(
                                            this.props.preferences.endDate,
                                        ).toDate()
                                        : null
                                }
                                container="inline"
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
                        <div style={{ float: 'right' }}>
                            {this.props.user &&
                                isSmall && (
                                <IconButton
                                    onClick={this.handleToggleDateRange}
                                >
                                    <DateIcon nativeColor="white" />
                                </IconButton>
                            )}
                            {this.props.showCurrenciesDrawer && (
                                <IconButton
                                    onClick={
                                        this.onClickCurrenciesDrawerTrigger
                                    }
                                >
                                    <MonetizationOn nativeColor="white" />
                                </IconButton>
                            )}
                            {this.props.user && (
                                <IconButton onClick={this.onClickRefresh}>
                                    <Refresh nativeColor="white" />
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
    ({ screen, screenSize, user, title, preferences }) => ({
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
