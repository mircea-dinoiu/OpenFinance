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
import MonetizationOn from 'material-ui-icons/MonetizationOn';
import Refresh from 'material-ui-icons/Refresh';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Logged from 'mobile/ui/appBar/Logged';
import {
    updateState,
    setEndDate,
    refreshWidgets,
    updatePreferences,
} from 'common/state/actions';
import { bindActionCreators } from 'redux';
import { formatYMD, shiftDateBack, shiftDateForward } from 'common/utils/dates';
import moment from 'moment';
import { ShiftDateOptions } from 'common/defs';

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

class TopBar extends PureComponent<TypeProps> {
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

    renderEndDateIntervalSelect() {
        return (
            <SelectField
                value={this.props.preferences.endDateIncrement}
                onChange={this.handleEndDateIntervalDropdownChange}
                style={{
                    width: '120px',
                }}
            >
                {Object.entries(ShiftDateOptions).map(([id, name]) => (
                    <MenuItem key={id} value={id} primaryText={name} />
                ))}
            </SelectField>
        );
    }

    render() {
        return (
            <AppBar
                title={this.props.title}
                showMenuIconButton={false}
                iconElementRight={
                    <ToolbarGroup>
                        {this.props.showCurrenciesDrawer && (
                            <IconButton
                                onClick={this.onClickCurrenciesDrawerTrigger}
                            >
                                <MonetizationOn color="white" />
                            </IconButton>
                        )}
                        {this.props.user && (
                            <IconButton onClick={this.onClickRefresh}>
                                <Refresh color="white" />
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
                }}
            >
                {this.props.user &&
                    !this.props.screen.isSmall && (
                    <Paper
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '5px',
                            transform: 'translateX(-50%)',
                            height: '48px',
                        }}
                    >
                        <IconButton
                            style={{ float: 'left' }}
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
                            style={{ float: 'left' }}
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
