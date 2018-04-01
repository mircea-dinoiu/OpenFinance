import React, {PureComponent} from 'react';
import {TextField, DatePicker, TimePicker, SelectField, MenuItem} from 'material-ui';
import {Row, Col} from 'react-grid-system';
import RepeatOptions from 'common/defs/repeatOptions';
import {connect} from "react-redux";

class IncomeForm extends PureComponent {
    props: {
        initialValues: {},
        onFormChange: Function
    };

    state = this.props.initialValues;

    setState(state) {
        this.props.onFormChange({...this.state, ...state});

        return super.setState(state);
    }

    renderSum() {
        return (
            <TextField
                floatingLabelText="Sum"
                floatingLabelFixed={true}
                value={this.state.sum}
                fullWidth={true}
                type="number"
                onChange={event => this.setState({sum: event.target.value})}
            />
        );
    }

    renderDescription() {
        return (
            <TextField
                floatingLabelText="Description"
                floatingLabelFixed={true}
                value={this.state.description}
                fullWidth={true}
                onChange={event => this.setState({description: event.target.value})}
            />
        );
    }

    renderDateTime() {
        return (
            <Row>
                <Col xs={6}>
                    <DatePicker
                        floatingLabelText="Date"
                        floatingLabelFixed={true}
                        fullWidth={true}
                        value={this.state.date}
                        onChange={(e, value) => this.setState({date: value})}
                    />
                </Col>
                <Col xs={6}>
                    <TimePicker
                        floatingLabelText="Time"
                        floatingLabelFixed={true}
                        fullWidth={true}
                        value={this.state.time}
                        onChange={(e, value) => this.setState({time: value})}
                    />
                </Col>
            </Row>
        );
    }

    renderDestination() {
        return (
            <SelectField
                floatingLabelText="Destination"
                floatingLabelFixed={true}
                value={this.state.paymentMethod}
                onChange={(e, i, value) => this.setState({paymentMethod: value})}
                fullWidth={true}
            >
                {
                    this.props.moneyLocations.sortBy(each => each.get('name')).map(
                        map => ({value: map.get('id'), primaryText: map.get('name')})
                    ).toJS().map(props => <MenuItem key={props.value} {...props}/>)
                }
            </SelectField>
        );
    }

    renderFrom() {
        return (
            <SelectField
                floatingLabelText="From"
                floatingLabelFixed={true}
                value={this.state.userId}
                onChange={(e, i, value) => this.setState({userId: value})}
                fullWidth={true}
            >
                {
                    this.props.user.get('list').sortBy(each => each.get('full_name')).map(
                        map => ({value: map.get('id'), primaryText: map.get('full_name')})
                    ).toJS().map(props => <MenuItem key={props.value} {...props}/>)
                }
            </SelectField>
        );
    }

    renderRepeat() {
        return (
            <SelectField
                floatingLabelText="Repeat"
                floatingLabelFixed={true}
                value={this.state.repeat}
                onChange={(e, i, value) => this.setState({repeat: value})}
                fullWidth={true}
            >
                {
                    RepeatOptions.map(arr => ({
                        value: arr[0],
                        primaryText: arr[1]
                    })).map(props => <MenuItem key={props.value} {...props}/>)
                }
            </SelectField>
        );
    }

    render() {
        return (
            <Col>
                <Row>
                    <Col xs={6}>
                        {this.renderSum()}
                    </Col>
                    <Col xs={6}>
                        {this.renderRepeat()}
                    </Col>
                </Row>
                {this.renderDescription()}
                {this.renderDateTime()}
                <Row>
                    <Col xs={6}>
                        {this.renderDestination()}
                    </Col>
                    <Col xs={6}>
                        {this.renderFrom()}
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default connect(
    ({
         moneyLocations,
         user,
     }) => ({
        moneyLocations,
        user,
    })
)(IncomeForm);