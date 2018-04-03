// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {AppBar, DatePicker, IconButton, Paper} from 'material-ui';
import EuroSymbol from 'material-ui-icons/EuroSymbol';
import ArrowBack from 'material-ui-icons/ArrowBack';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Logged from 'mobile/ui/appBar/Logged';
import {updateState, setEndDate} from 'common/state/actions';
import {bindActionCreators} from 'redux';
import {formatYMD} from 'common/utils/dates';
import moment from 'moment';

type TypeProps = {
    onLogout: Function,
    title: string,
    showCurrenciesDrawer: boolean,
    actions: {
        setEndDate: typeof setEndDate,
        updateState: typeof updateState,
    }
};

class TopBar extends PureComponent<TypeProps> {
    onShiftMonthBack = () => {
        this.props.actions.setEndDate(formatYMD(
            moment(this.props.endDate).subtract(1, 'month').toDate()
        ));
    };
    onShiftMonthForward = () => {
        this.props.actions.setEndDate(formatYMD(
            moment(this.props.endDate).add(1, 'month').toDate()
        ));
    };
    onChangeEndDate = (nothing, date) => {
        this.props.actions.setEndDate(formatYMD(date));
    };

    render() {
        return (
            <AppBar
                title={this.props.title}
                showMenuIconButton={this.props.showCurrenciesDrawer}
                onLeftIconButtonClick={() => this.props.actions.updateState({currenciesDrawerOpen: true})}
                iconElementLeft={<IconButton><EuroSymbol/></IconButton>}
                iconElementRight={this.props.user ? <Logged onLogout={this.props.onLogout}/> : null}
                style={{
                    position: 'fixed',
                    top: 0,
                }}
            >
                {this.props.user && !this.props.screen.isSmall && (
                    <Paper style={{
                        position: 'absolute',
                        left: '50%',
                        top: '5px',
                        transform: 'translateX(-50%)'
                    }}>
                        <IconButton style={{float: 'left'}} tooltip="Shift back one month" onClick={this.onShiftMonthBack}>
                            <ArrowBack/>
                        </IconButton>
                        <DatePicker
                            style={{float: 'left'}}
                            textFieldStyle={{textAlign: 'center', width: '85px'}}
                            hintText=""
                            value={this.props.endDate ? moment(this.props.endDate).toDate() : null}
                            container="inline"
                            onChange={this.onChangeEndDate}
                        />
                        <IconButton style={{float: 'left'}} tooltip="Shift forward one month" onClick={this.onShiftMonthForward}>
                            <ArrowForward/>
                        </IconButton>
                    </Paper>
                )}
            </AppBar>
        )
    }
}

export default connect(
    ({screen, user, title, endDate}) => ({screen, user, title, endDate}),
    dispatch => ({
        actions: bindActionCreators({
            updateState,
            setEndDate,
        }, dispatch)
    })
)(TopBar);