// @flow
import React, { PureComponent } from 'react';
import { Row, Col } from 'react-grid-system';
import { Badge, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RepeatOptions from 'common/defs/repeatOptions';
import { fetch } from 'common/utils/fetch';
import routes from 'common/defs/routes';
import { stringify } from 'query-string';
import { connect } from 'react-redux';
import { MultiSelect, SingleSelect } from 'common/components/Select';
import { arrToCsv } from 'common/transformers';
import { overflowVisible } from 'common/defs/styles';
import { DatePicker, TimePicker } from 'material-ui-pickers';

const boxStyle = {
    padding: '10px 0',
};
const badgeStyle = {
    root: {
        lineHeight: '16px',
    },
    badge: {
        top: 0,
        right: 0,
        position: 'relative',
        margin: '0 5px',
        height: 16,
        lineHeight: '16px',
        width: 'auto',
        padding: '0 5px',
        borderRadius: 3,
    },
};
const StyledBadge = withStyles(badgeStyle)(Badge);

class ExpenseForm extends PureComponent {
    props: {
        initialValues: {},
        onFormChange: Function,
    };

    state = {
        descriptionSuggestions: [],
        descriptionNewOptionText: '',
        ...this.props.initialValues,
    };

    setState(state) {
        this.props.onFormChange({ ...this.state, ...state });

        return super.setState(state);
    }

    bindSelect({ valueKey, onChange = () => {} }) {
        return {
            onChange: (value) => {
                this.setState({
                    [valueKey]: value,
                });

                onChange(value);
            },
            value: this.state[valueKey],
        };
    }

    get descriptionNewOptions() {
        const text =
            this.state.descriptionNewOptionText || this.state.description;

        if (text) {
            return [
                {
                    value: text,
                    label: text,
                },
            ];
        }

        return [];
    }

    renderSum() {
        return (
            <Row>
                <Col xs={4} style={overflowVisible}>
                    <SingleSelect
                        label="Currency"
                        {...this.bindSelect({
                            valueKey: 'currency',
                        })}
                        options={this.props.currencies
                            .get('map')
                            .map((map) => ({
                                value: map.get('id'),
                                label: map.get('iso_code'),
                            }))
                            .toArray()}
                    />
                </Col>
                <Col xs={8}>
                    <TextField
                        label="Sum"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.sum}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({ sum: event.target.value })
                        }
                    />
                </Col>
            </Row>
        );
    }

    renderDescription() {
        const valueKey = 'description';

        return (
            <SingleSelect
                label="Description"
                {...this.bindSelect({
                    valueKey,
                    onChange: this.handleDescriptionChange,
                })}
                onInputChange={this.handleDescriptionInputChange}
                options={this.descriptionNewOptions.concat(
                    this.state.descriptionSuggestions.map((each) => ({
                        value: each.item,
                        label: (
                            <StyledBadge
                                color="primary"
                                badgeContent={each.usages}
                            >
                                {each.item}
                            </StyledBadge>
                        ),
                    })),
                )}
            />
        );
    }

    fetchDescriptionSuggestions = async (search) => {
        const response = await fetch(
            `${routes.suggestion.expense.descriptions}?${stringify({
                search,
                end_date: this.props.preferences.endDate,
            })}`,
        );
        const descriptionSuggestions = await response.json();

        this.setState({
            descriptionSuggestions,
        });
    };

    handleDescriptionInputChange = (value) => {
        this.fetchDescriptionSuggestions(value);

        if (value) {
            this.setState({
                descriptionNewOptionText: value,
            });
        }

        return value;
    };

    handleDescriptionChange = async (search) => {
        if (search) {
            const response = await fetch(
                `${routes.suggestion.expense.categories}?${stringify({
                    search,
                })}`,
            );
            const categories = arrToCsv(await response.json());

            this.setState((prevState) => ({
                categories: prevState.categories
                    ? prevState.categories
                    : categories,
            }));
        }
    };

    renderDateTime() {
        return (
            <Row>
                <Col xs={6}>
                    <DatePicker
                        style={{ width: '100%' }}
                        label="Date"
                        showTodayButton
                        value={this.state.date}
                        onChange={(value) => this.setState({ date: value })}
                    />
                </Col>
                <Col xs={6}>
                    <TimePicker
                        style={{ width: '100%' }}
                        label="Time"
                        showTodayButton
                        todayLabel="now"
                        value={this.state.time}
                        onChange={(value) => this.setState({ time: value })}
                    />
                </Col>
            </Row>
        );
    }

    renderPaymentMethod() {
        return (
            <SingleSelect
                label="Payment Method"
                {...this.bindSelect({
                    valueKey: 'paymentMethod',
                })}
                options={this.props.moneyLocations
                    .sortBy((each) => each.get('name'))
                    .map((map) => ({
                        value: map.get('id'),
                        label: map.get('name'),
                    }))
                    .toJS()}
            />
        );
    }

    renderChargedPersons() {
        return (
            <MultiSelect
                label="Charged Persons"
                {...this.bindSelect({
                    valueKey: 'chargedPersons',
                })}
                options={this.props.user
                    .get('list')
                    .sortBy((each) => each.get('full_name'))
                    .map((each) => ({
                        value: each.get('id'),
                        label: each.get('full_name'),
                    }))
                    .toJS()}
            />
        );
    }

    renderCategories() {
        return (
            <MultiSelect
                label="Categories"
                {...this.bindSelect({
                    valueKey: 'categories',
                })}
                filterOption={(option, search) =>
                    option.filterText
                        .toLowerCase()
                        .includes(search.toLowerCase())
                }
                options={this.props.categories
                    .sortBy((each) => each.get('name'))
                    .map((each) => ({
                        value: each.get('id'),
                        label: (
                            <StyledBadge
                                color="primary"
                                badgeContent={each.get('expenses')}
                            >
                                {each.get('name')}
                            </StyledBadge>
                        ),
                        filterText: each.get('name'),
                    }))
                    .toJS()}
            />
        );
    }

    renderRepeat() {
        return (
            <SingleSelect
                label="Repeat"
                {...this.bindSelect({
                    valueKey: 'repeat',
                })}
                options={RepeatOptions.map((arr) => ({
                    value: arr[0],
                    label: arr[1],
                }))}
            />
        );
    }

    render() {
        return (
            <Col style={overflowVisible}>
                <div style={boxStyle}>{this.renderDescription()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>{this.renderCategories()}</div>
                <div style={boxStyle}>{this.renderPaymentMethod()}</div>
                <div style={boxStyle}>{this.renderChargedPersons()}</div>
                <div style={boxStyle}>{this.renderRepeat()}</div>
            </Col>
        );
    }
}

export default connect(
    ({ currencies, preferences, categories, moneyLocations, user }) => ({
        currencies,
        categories,
        preferences,
        moneyLocations,
        user,
    }),
)(ExpenseForm);
