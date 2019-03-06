// @flow
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { findCurrencyById } from 'common/helpers/currency';

import React, { PureComponent } from 'react';
import { Row, Col } from 'react-grid-system';
import { Badge, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RepeatOptions from 'common/defs/repeatOptions';
import { createXHR } from 'common/utils/fetch';
import routes from 'common/defs/routes';
import { stringify } from 'query-string';
import { connect } from 'react-redux';
import { MultiSelect, SingleSelect } from 'common/components/Select';
import { overflowVisible } from 'common/defs/styles';
import { DateTimePicker } from 'material-ui-pickers';
import { CancelToken } from 'axios';

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

type TypeProps = {
    initialValues: {},
    onFormChange: Function,
};

class ExpenseForm extends PureComponent<TypeProps> {
    descriptionSuggestionsCancelSource = CancelToken.source();
    categoriesCancelSource;

    state = {
        descriptionSuggestions: [],
        descriptionNewOptionText: this.props.initialValues.description || '',
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
        const text = this.state.descriptionNewOptionText;
        const arr = [];

        if (text) {
            arr.push({
                value: text,
                label: text,
            });
        }

        const initialDescription = this.props.initialValues.description;

        if (initialDescription && initialDescription !== text) {
            arr.push({
                value: initialDescription,
                label: initialDescription,
            });
        }

        return arr;
    }

    renderSum() {
        return (
            <Row>
                <Col xs={4} style={overflowVisible}>
                    <TextField
                        label="Currency"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={
                            this.state.paymentMethod
                                ? findCurrencyById(
                                    this.props.moneyLocations
                                        .toJSON()
                                        .find(
                                            (each) =>
                                                each.id ==
                                                  this.state.paymentMethod,
                                        ).currency_id,
                                    this.props.currencies,
                                ).iso_code
                                : null
                        }
                        fullWidth={true}
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        disabled={true}
                    />
                </Col>
                <Col xs={4}>
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
                <Col xs={4}>
                    <TextField
                        label="Weight (grams)"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.weight}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({ weight: event.target.value })
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
                inputValue={this.state.descriptionNewOptionText}
            />
        );
    }

    handleNotesChange = (event) => {
        this.setState({ notes: event.target.value });
    };

    renderNotes() {
        return (
            <TextField
                value={this.state.notes}
                label="Notes"
                multiline
                margin="none"
                fullWidth={true}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleNotesChange}
            />
        );
    }

    fetchDescriptionSuggestions = async (search) => {
        if (!search) {
            return;
        }

        if (this.descriptionSuggestionsCancelSource) {
            this.descriptionSuggestionsCancelSource.cancel();
        }

        this.descriptionSuggestionsCancelSource = CancelToken.source();

        const response = await createXHR({
            url: `${routes.suggestion.expense.descriptions}?${stringify({
                search,
                end_date: this.props.preferences.endDate,
            })}`,
            cancelToken: this.descriptionSuggestionsCancelSource.token,
        });
        const descriptionSuggestions = response.data;

        this.setState({
            descriptionSuggestions,
        });
    };

    handleDescriptionInputChange = (value, { action }) => {
        if (action === 'input-change') {
            this.setState({
                descriptionNewOptionText: value,
            });

            this.fetchDescriptionSuggestions(value);
        }
    };

    handleDescriptionChange = async (search) => {
        if (search) {
            if (this.categoriesCancelSource) {
                this.categoriesCancelSource.cancel();
            }

            this.categoriesCancelSource = CancelToken.source();

            const response = await createXHR({
                url: `${routes.suggestion.expense.categories}?${stringify({
                    search,
                })}`,
                cancelToken: this.categoriesCancelSource.token,
            });
            const categories = response.data;

            this.setState((prevState) => ({
                categories: prevState.categories
                    ? prevState.categories
                    : categories,
            }));
        }
    };

    renderDateTime() {
        return (
            <DateTimePicker
                label="Date & Time"
                value={this.state.date}
                onChange={(value) => this.setState({ date: value })}
                showTodayButton
                style={{ width: '100%' }}
                ampm={false}
            />
        );
    }

    renderAccount() {
        return (
            <SingleSelect
                label="Account"
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
                label="Person(s)"
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
                    option.data.filterText
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
            <Row>
                <Col xs={6} style={{ overflow: 'initial' }}>
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
                </Col>
                <Col xs={6}>
                    <TextField
                        label="Occurrences"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.repeatOccurrences}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({
                                repeatOccurrences: event.target.value,
                            })
                        }
                        disabled={this.state.repeat == null}
                    />
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <Col style={overflowVisible}>
                <Row>
                    <Col xs={6}>
                        <div>{this.renderType()}</div>
                        <div>{this.renderStatus()}</div>
                    </Col>
                    <Col xs={6}>{this.renderFlags()}</Col>
                </Row>
                <div style={boxStyle}>{this.renderDescription()}</div>
                <div style={boxStyle}>{this.renderAccount()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>{this.renderCategories()}</div>
                <div style={boxStyle}>{this.renderChargedPersons()}</div>
                <div style={boxStyle}>{this.renderRepeat()}</div>
                <div style={boxStyle}>{this.renderNotes()}</div>
            </Col>
        );
    }

    renderType() {
        return (
            <>
                <FormLabel>Type</FormLabel>
                <RadioGroup
                    value={this.state.type}
                    onChange={this.handleChangeType}
                    row
                >
                    <FormControlLabel
                        value="withdrawal"
                        control={<Radio color="primary" />}
                        label="Withdrawal"
                        className="inlineBlock"
                    />
                    <FormControlLabel
                        value="deposit"
                        control={<Radio color="primary" />}
                        label="Deposit"
                        className="inlineBlock"
                    />
                </RadioGroup>
            </>
        );
    }

    handleChangeType = (event) => {
        this.setState({ type: event.target.value });
    };

    renderFlags() {
        return (
            <>
                <FormLabel>Flags</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.hidden}
                                onChange={(event) =>
                                    this.setState({
                                        hidden: event.target.checked,
                                    })
                                }
                                color="primary"
                                value="hidden"
                            />
                        }
                        label="Archived"
                    />
                </FormGroup>
            </>
        );
    }

    renderStatus() {
        return (
            <>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                    value={this.state.status}
                    onChange={this.handleChangeStatus}
                    row
                >
                    <FormControlLabel
                        value="pending"
                        control={<Radio color="primary" />}
                        label="Pending"
                        className="inlineBlock"
                    />
                    <FormControlLabel
                        value="finished"
                        control={<Radio color="primary" />}
                        label="Posted"
                        className="inlineBlock"
                    />
                </RadioGroup>
            </>
        );
    }

    handleChangeStatus = (event) => {
        this.setState({ status: event.target.value });
    };
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
