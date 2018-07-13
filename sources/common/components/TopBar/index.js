// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
    AppBar,
    DatePicker,
    IconButton,
    MenuItem,
    Paper,
    SelectField,
    ToolbarGroup,
} from 'material-ui';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Logged from 'mobile/ui/appBar/Logged';
import DateIcon from '@material-ui/icons/DateRange';
import {
    updateState,
    setEndDate,
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
        setEndDate: typeof setEndDate,
        updateState: typeof updateState,
        refreshWidgets: typeof refreshWidgets,
    },
};

const INPUT_HEIGHT = `${parseInt(Sizes.HEADER_SIZE) - 4}px`;

class TopBar extends PureComponent<TypeProps> {
    state = {
        showDateRange: false,
    };

    onShiftBack = () => {
        this.props.actions.updatePreferences({
            endDate: formatYMD(
                shiftDateBack(
                    this.props.preferences.endDate,
                    this.props.preferences.endDateIncrement,
                ),
            ),
        });
    };
    onShiftForward = () => {
        this.props.actions.updatePreferences({
            endDate: formatYMD(
                shiftDateForward(
                    this.props.preferences.endDate,
                    this.props.preferences.endDateIncrement,
                ),
            ),
        });
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

    render() {
        const isSmall = this.props.screen.isSmall;

        return (
            <AppBar
                title={this.props.title}
                titleStyle={{
                    height: Sizes.HEADER_SIZE,
                    lineHeight: Sizes.HEADER_SIZE,
                }}
                showMenuIconButton={false}
                iconStyleRight={{
                    marginTop: 0,
                }}
                iconElementRight={
                    <ToolbarGroup>
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
                                onClick={this.onClickCurrenciesDrawerTrigger}
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
                    </ToolbarGroup>
                }
                style={{
                    position: 'fixed',
                    top: 0,
                    height: Sizes.HEADER_SIZE,
                }}
            >
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
                        <IconButton
                            style={{ float: 'left', height: INPUT_HEIGHT }}
                            tooltip={`Shift back ${
                                ShiftDateOptions[
                                    this.props.preferences.endDateIncrement
                                ]
                            }`}
                            onClick={this.onShiftBack}
                        >
                            <ArrowBack />
                        </IconButton>
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
                        />
                        <IconButton
                            style={{ float: 'left', height: INPUT_HEIGHT }}
                            tooltip={`Shift forward ${
                                ShiftDateOptions[
                                    this.props.preferences.endDateIncrement
                                ]
                            }`}
                            onClick={this.onShiftForward}
                        >
                            <ArrowForward />
                        </IconButton>
                        {this.renderEndDateIntervalSelect()}
                    </Paper>
                )}
            </AppBar>
        );
    }
}

export default connect(
    ({ screen, user, title, preferences }) => ({
        screen,
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
