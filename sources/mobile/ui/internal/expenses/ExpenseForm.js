import React, {PureComponent} from 'react';
import {TextField, DatePicker, TimePicker, SelectField, MenuItem, Chip, Avatar, RaisedButton} from 'material-ui';
import {Row, Col} from 'react-grid-system';
import {grey100} from 'material-ui/styles/colors';
import RepeatOptions from 'common/defs/repeatOptions';

const greyBoxStyle = {backgroundColor: grey100, paddingBottom: 10, marginTop: 10, marginBottom: 10};

export default class ExpenseEditor extends PureComponent {
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
            <Row>
                <Col xs={4}>
                    <SelectField
                        floatingLabelText="Currency"
                        floatingLabelFixed={true}
                        value={this.state.currency}
                        onChange={(e, i, value) => this.setState({currency: value})}
                        fullWidth={true}
                    >
                        {
                            this.props.currencies.get('map').map(
                                map => ({value: map.get('id'), primaryText: map.get('iso_code')})
                            ).toArray().map(props => <MenuItem key={props.value} {...props}/>)
                        }
                    </SelectField>
                </Col>
                <Col xs={8}>
                    <TextField
                        floatingLabelText="Sum"
                        floatingLabelFixed={true}
                        value={this.state.sum}
                        fullWidth={true}
                        type="number"
                        onChange={event => this.setState({sum: event.target.value})}
                    />
                </Col>
            </Row>
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

    renderPaymentMethod() {
        return (
            <SelectField
                floatingLabelText="Payment Method"
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

    renderChargedPersons() {
        return (
            <Row style={greyBoxStyle}>
                <Col>
                    <SelectField
                        floatingLabelText="Charged Persons"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({chargedPersons: this.state.chargedPersons.concat(value)})}
                        fullWidth={true}
                    >
                        {
                            this.props.user.get('list')
                                .sortBy(each => each.get('full_name'))
                                .filter(each => !this.state.chargedPersons.includes(each.get('id')))
                                .map(
                                    map => ({value: map.get('id'), primaryText: map.get('full_name')})
                                ).toJS().map(props => <MenuItem key={props.value} {...props}/>)
                        }
                    </SelectField>
                </Col>

                <Col style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}>
                    {this.state.chargedPersons.map(id => {
                        const [, user] = this.props.user.get('list').findEntry(each => each.get('id') == id);

                        return (
                            <Chip
                                style={{margin: '5px 5px 0 0'}}
                                key={id}
                                onRequestDelete={() => this.setState({
                                        chargedPersons: this.state.chargedPersons.filter(each => each !== id)
                                    })}
                            >
                                <Avatar src={user.get('avatar')}/>
                                {user.get('full_name')}
                            </Chip>
                        );
                    })}
                </Col>
            </Row>
        );
    }

    renderCategories() {
        return (
            <Row style={greyBoxStyle}>
                <Col>
                    <SelectField
                        floatingLabelText="Categories"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({categories: this.state.categories.concat(value)})}
                        fullWidth={true}
                    >
                        {
                            this.props.categories
                                .sortBy(each => each.get('name'))
                                .filter(each => !this.state.categories.includes(each.get('id')))
                                .map(
                                    map => ({value: map.get('id'), primaryText: map.get('name')})
                                ).toJS().map(props => <MenuItem key={props.value} {...props}/>)
                        }
                    </SelectField>
                </Col>

                <Col style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}>
                    {this.state.categories.map(id => {
                        const [, entity] = this.props.categories.findEntry(each => each.get('id') == id);

                        return (
                            <Chip
                                style={{margin: 5}}
                                key={id}
                                onRequestDelete={() => this.setState({
                                        categories: this.state.categories.filter(each => each !== id)
                                    })}
                            >
                                {entity.get('name')}
                            </Chip>
                        );
                    })}
                </Col>
            </Row>
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
                {this.renderSum()}
                {this.renderDescription()}
                {this.renderDateTime()}
                {this.renderCategories()}
                {this.renderPaymentMethod()}
                {this.renderChargedPersons()}
                {this.renderRepeat()}
            </Col>
        );
    }
}