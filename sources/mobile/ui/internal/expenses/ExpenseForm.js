import React, {PureComponent} from 'react';
import {
    AutoComplete,
    TextField,
    DatePicker,
    TimePicker,
    SelectField,
    MenuItem,
    Chip,
    Avatar
} from 'material-ui';
import {Row, Col} from 'react-grid-system';
import {grey100} from 'material-ui/styles/colors';
import RepeatOptions from 'common/defs/repeatOptions';
import {fetch} from 'common/utils/fetch';
import routes from 'common/defs/routes';
import {stringify} from 'query-string';
import {connect} from 'react-redux';

const greyBoxStyle = {
    backgroundColor: grey100,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10
};

class ExpenseForm extends PureComponent {
    props: {
        initialValues: {},
        onFormChange: Function
    };

    state = {
        descriptionSuggestions: [],
        ...this.props.initialValues
    };

    setState(state) {
        this.props.onFormChange({...this.state, ...state});

        return super.setState(state);
    }

    bindAutoComplete({
        searchKey,
        valueKey,
        multiple = true,
        defaultSearchText = '',
        forceSelection = true,
        onUpdateInput = () => {}
    }) {
        return {
            searchText: this.state[searchKey] || defaultSearchText,
            onUpdateInput: (value) => {
                if (multiple) {
                    this.setState({
                        [searchKey]: value
                    });
                } else {
                    this.setState({
                        [searchKey]: value,
                        [valueKey]: forceSelection ? null : value
                    });
                }

                onUpdateInput(value);
            },
            openOnFocus: true,
            filter: AutoComplete.fuzzyFilter,
            listStyle: {
                maxHeight: 200,
                overflow: 'auto'
            },
            animated: false,
            onNewRequest: ({value}) => {
                if (multiple) {
                    this.setState({
                        [searchKey]: '',
                        [valueKey]: this.state[valueKey].concat(
                            Number(value.key)
                        )
                    });
                } else {
                    this.setState({
                        [valueKey]: value.key
                    });
                }
            },
            popoverProps: {
                style: {
                    position: 'absolute'
                }
            }
        };
    }

    renderSum() {
        return (
            <Row>
                <Col xs={4}>
                    <SelectField
                        floatingLabelText="Currency"
                        floatingLabelFixed={true}
                        value={this.state.currency}
                        onChange={(e, i, value) =>
                            this.setState({currency: value})
                        }
                        fullWidth={true}
                    >
                        {this.props.currencies
                            .get('map')
                            .map((map) => ({
                                value: map.get('id'),
                                primaryText: map.get('iso_code')
                            }))
                            .toArray()
                            .map((props) => (
                                <MenuItem key={props.value} {...props} />
                            ))}
                    </SelectField>
                </Col>
                <Col xs={8}>
                    <TextField
                        floatingLabelText="Sum"
                        floatingLabelFixed={true}
                        value={this.state.sum}
                        fullWidth={true}
                        type="number"
                        onChange={(event) =>
                            this.setState({sum: event.target.value})
                        }
                    />
                </Col>
            </Row>
        );
    }

    renderDescription() {
        const searchKey = 'descriptionSearch';
        const valueKey = 'description';

        return (
            <AutoComplete
                floatingLabelText="Description"
                floatingLabelFixed={true}
                {...this.bindAutoComplete({
                    searchKey,
                    valueKey,
                    multiple: false,
                    forceSelection: false,
                    onUpdateInput: (value) =>
                        this.fetchDescriptionSuggestions(value),
                    defaultSearchText: this.state[valueKey]
                })}
                fullWidth={true}
                onBlur={this.onDescriptionBlur}
                dataSource={this.state.descriptionSuggestions.map((each) => ({
                    text: each.item,
                    value: (
                        <MenuItem
                            key={each.item}
                            primaryText={each.item}
                            secondaryText={<em>{each.usages} usages</em>}
                        />
                    )
                }))}
            />
        );
    }

    async fetchDescriptionSuggestions(search) {
        const response = await fetch(
            `${routes.suggestion.expense.descriptions}?${stringify({
                search,
                end_date: this.props.endDate
            })}`
        );
        const descriptionSuggestions = await response.json();

        this.setState({
            descriptionSuggestions
        });
    }

    onDescriptionBlur = async (event) => {
        const search = event.target.value.toLowerCase().trim();

        if (search) {
            const response = await fetch(
                `${routes.suggestion.expense.categories}?${stringify({
                    search
                })}`
            );
            const categories = await response.json();

            this.setState({
                categories
            });
        }
    };

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
        const searchKey = 'paymentSearch';
        const valueKey = 'paymentMethod';

        return (
            <AutoComplete
                floatingLabelText="Payment Method"
                floatingLabelFixed={true}
                {...this.bindAutoComplete({
                    searchKey,
                    valueKey,
                    multiple: false,
                    defaultSearchText:
                        this.state[valueKey] != null
                            ? this.props.moneyLocations
                                .find(
                                    (each) =>
                                        each.get('id') == this.state[valueKey]
                                )
                                .get('name')
                            : ''
                })}
                fullWidth={true}
                dataSource={this.props.moneyLocations
                    .sortBy((each) => each.get('name'))
                    .map((map) => ({
                        value: map.get('id'),
                        primaryText: map.get('name')
                    }))
                    .toJS()
                    .map((props) => ({
                        value: <MenuItem key={props.value} {...props} />,
                        text: props.primaryText
                    }))}
            />
        );
    }

    renderChargedPersons() {
        return (
            <Row style={greyBoxStyle}>
                <Col>
                    <AutoComplete
                        floatingLabelText="Charged Persons"
                        floatingLabelFixed={true}
                        {...this.bindAutoComplete({
                            searchKey: 'usersSearch',
                            valueKey: 'chargedPersons'
                        })}
                        fullWidth={true}
                        dataSource={this.props.user
                            .get('list')
                            .sortBy((each) => each.get('full_name'))
                            .filter(
                                (each) =>
                                    !this.state.chargedPersons.includes(
                                        each.get('id')
                                    )
                            )
                            .toJS()
                            .map((record) => ({
                                value: (
                                    <MenuItem
                                        key={record.id}
                                        primaryText={record.full_name}
                                        secondaryText={
                                            <Avatar src={record.avatar} />
                                        }
                                    />
                                ),
                                text: record.full_name
                            }))}
                    />
                </Col>

                <Col
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    {this.state.chargedPersons.map((id) => {
                        const [, user] = this.props.user
                            .get('list')
                            .findEntry((each) => each.get('id') == id);

                        return (
                            <Chip
                                style={{margin: '5px 5px 0 0', height: 32}}
                                key={id}
                                onRequestDelete={() =>
                                    this.setState({
                                        chargedPersons: this.state.chargedPersons.filter(
                                            (each) => each !== id
                                        )
                                    })
                                }
                            >
                                <Avatar src={user.get('avatar')} />
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
                    <AutoComplete
                        floatingLabelText="Categories"
                        floatingLabelFixed={true}
                        {...this.bindAutoComplete({
                            searchKey: 'categoriesSearch',
                            valueKey: 'categories'
                        })}
                        fullWidth={true}
                        dataSource={this.props.categories
                            .sortBy((each) => each.get('name'))
                            .filter(
                                (each) =>
                                    !this.state.categories.includes(
                                        each.get('id')
                                    )
                            )
                            .toJS()
                            .map((record) => ({
                                value: (
                                    <MenuItem
                                        key={record.id}
                                        primaryText={record.name}
                                        secondaryText={record.expenses}
                                    />
                                ),
                                text: record.name
                            }))}
                    />
                </Col>

                <Col
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    {this.state.categories.map((id) => {
                        const [, entity] = this.props.categories.findEntry(
                            (each) => each.get('id') == id
                        );

                        return (
                            <Chip
                                style={{margin: 5, height: 32}}
                                key={id}
                                onRequestDelete={() =>
                                    this.setState({
                                        categories: this.state.categories.filter(
                                            (each) => each !== id
                                        )
                                    })
                                }
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
            <AutoComplete
                floatingLabelText="Repeat"
                floatingLabelFixed={true}
                {...this.bindAutoComplete({
                    searchKey: 'repeatSearch',
                    valueKey: 'repeat',
                    multiple: false,
                    defaultSearchText:
                        this.state.repeat != null
                            ? RepeatOptions.find(
                                (each) => each[0] === this.state.repeat
                            )[1]
                            : ''
                })}
                fullWidth={true}
                dataSource={RepeatOptions.map((arr) => ({
                    value: arr[0],
                    primaryText: arr[1]
                })).map((props) => ({
                    value: <MenuItem key={props.value} {...props} />,
                    text: props.primaryText
                }))}
            />
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

export default connect(({currencies, categories, moneyLocations, user}) => ({
    currencies,
    categories,
    moneyLocations,
    user
}))(ExpenseForm);
