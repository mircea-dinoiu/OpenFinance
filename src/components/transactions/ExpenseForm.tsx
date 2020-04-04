import {
    Avatar,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Radio,
    RadioGroup,
    Slider,
    TextField,
} from '@material-ui/core';
import {DateTimePicker} from '@material-ui/pickers';
// @ts-ignore
import {CancelToken} from 'axios';
import {MuiReactSelect, MuiReactSelectAsyncCreatable, MuiSelectNative} from 'components/dropdowns';
import {TransactionStatus} from 'defs';
import {RepeatOptions} from 'defs/repeatOptions';
import {routes} from 'defs/routes';
import {gridGap, screenQuerySmall, spacingLarge, spacingSmall} from 'defs/styles';
import {findCurrencyById} from 'helpers/currency';
import {PERC_MAX, PERC_STEP, RepeatOption} from 'js/defs';
import {sumArray} from 'js/utils/numbers';
import {sortBy} from 'lodash';

import React, {PureComponent} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {
    Accounts,
    Categories,
    Currencies,
    GlobalState,
    Preferences,
    TransactionForm,
    Users,
} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

const boxStyle = {
    padding: '10px 0',
};
type TypeProps = {
    initialValues: TransactionForm;
    onFormChange: Function;
    moneyLocations: Accounts;
    currencies: Currencies;
    preferences: Preferences;
    user: Users;
    categories: Categories;
};

type DescriptionSuggestion = {
    item: string;
    usages: number;
};

export const setChargedPersonValueFactory = (
    id,
    value,
    {userIdsStringified, adjust = true},
) => (prevState) => {
    const step = PERC_STEP;
    const nextChargedPersons = {
        ...userIdsStringified.reduce((acc, idString) => {
            acc[idString] = 0;

            return acc;
        }, {}),
        ...prevState.chargedPersons,
        [id]: value,
    };

    if (adjust) {
        let diffToMax;

        while (
            (diffToMax = PERC_MAX - sumArray(Object.values(nextChargedPersons)))
        ) {
            for (const key in nextChargedPersons) {
                if (key !== id) {
                    nextChargedPersons[key] += diffToMax > 0 ? step : -step;
                    break;
                }
            }
        }
    }

    return {
        chargedPersons: nextChargedPersons,
    };
};

const FormControlLabelInline = styled(FormControlLabel)`
    display: inline-block;
`;

type State = TransactionForm;

class ExpenseFormWrapped extends PureComponent<TypeProps, State> {
    // @ts-ignore
    descriptionSuggestionsCancelSource = CancelToken.source();
    categoriesCancelSource;

    state: State = {
        ...this.props.initialValues,
    };

    setState(state) {
        this.props.onFormChange({...this.state, ...state});

        return super.setState(state);
    }

    renderSum() {
        return (
            <SumContainer>
                <div>
                    <TextField
                        label="Amount"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {this.state.paymentMethod
                                        ? findCurrencyById(
                                              this.props.moneyLocations.find(
                                                  (each) =>
                                                      each.id ==
                                                      this.state.paymentMethod,
                                                  // @ts-ignore
                                              ).currency_id,
                                              this.props.currencies,
                                          ).iso_code
                                        : ''}
                                </InputAdornment>
                            ),
                        }}
                        value={this.state.sum}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) =>
                            this.setState({sum: event.target.value})
                        }
                    />
                </div>
                <div>
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
                            this.setState({weight: event.target.value})
                        }
                    />
                </div>
            </SumContainer>
        );
    }

    renderDescription() {
        const value = this.state.description;

        return (
            <MuiReactSelectAsyncCreatable
                label="Name"
                createOptionPosition="first"
                onChange={this.handleDescriptionChange}
                cacheOptions={true}
                defaultOptions={value ? [{value, label: value}] : []}
                loadOptions={this.fetchDescriptionSuggestions}
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

        // @ts-ignore
        this.descriptionSuggestionsCancelSource = CancelToken.source();

        const response = await createXHR<DescriptionSuggestion[]>({
            url: makeUrl(routes.transactionsSuggestions.descriptions, {
                search,
                end_date: this.props.preferences.endDate,
            }),
            cancelToken: this.descriptionSuggestionsCancelSource.token,
        });

        return response.data.map((ds) => ({
            value: ds.item,
            label: ds.item,
        }));
    };

    handleDescriptionChange = async ({
        value: description,
    }: {
        value: string;
        label: string;
    }) => {
        this.setState({description: description});

        if (description) {
            if (this.categoriesCancelSource) {
                this.categoriesCancelSource.cancel();
            }

            // @ts-ignore
            this.categoriesCancelSource = CancelToken.source();

            const response = await createXHR({
                url: makeUrl(routes.transactionsSuggestions.categories, {
                    search: description,
                }),
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
                onChange={(value) => this.setState({date: value})}
                showTodayButton
                style={{width: '100%'}}
                ampm={false}
            />
        );
    }

    renderAccount() {
        const options = sortBy(this.props.moneyLocations, 'name').map(
            (map) => ({
                value: map.id,
                label: map.name,
            }),
        );

        return (
            <MuiSelectNative
                label="Account"
                options={options}
                value={options.find(
                    (o) => o.value === this.state.paymentMethod,
                )}
                onChange={({value}: {value: number}) =>
                    this.setState({paymentMethod: value})
                }
            />
        );
    }

    renderChargedPersons() {
        const sortedUsers = sortBy(
            this.props.user.list,
            (each) => each.full_name,
        );
        const {chargedPersons} = this.state;
        const step = PERC_STEP;
        const userIdsStringified = sortedUsers.map((user) => String(user.id));

        return (
            <List
                subheader={
                    <ListSubheader disableGutters={true} disableSticky={true}>
                        Distribution per Person
                    </ListSubheader>
                }
                disablePadding={true}
                dense={true}
            >
                {sortedUsers.map((user) => {
                    const id = String(user.id);

                    return (
                        <ListItem key={id} disableGutters={true}>
                            <ListItemAvatar>
                                <Avatar
                                    style={{margin: 0}}
                                    alt={user.full_name}
                                    src={user.avatar}
                                />
                            </ListItemAvatar>

                            <Slider
                                value={chargedPersons[id] || 0}
                                valueLabelFormat={(value) => `${value}%`}
                                step={step}
                                marks={true}
                                onChange={(event, value) =>
                                    this.setState(
                                        setChargedPersonValueFactory(
                                            id,
                                            value,
                                            {
                                                userIdsStringified,
                                            },
                                        ),
                                    )
                                }
                                valueLabelDisplay="on"
                            />

                            <ListItemText
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                {user.full_name}
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    renderCategories() {
        const options = sortBy(this.props.categories, 'name').map((each) => ({
            value: each.id,
            label: each.name,
        }));

        return (
            <MuiReactSelect
                label="Categories"
                isMulti={true}
                options={options}
                value={options.filter((o) =>
                    this.state.categories.includes(o.value),
                )}
                onChange={(
                    nextOptions: Array<{
                        value: number;
                        label: string;
                    }>,
                ) =>
                    this.setState({
                        categories: nextOptions
                            ? nextOptions.map((o) => o.value)
                            : [],
                    })
                }
            />
        );
    }

    renderRepeat() {
        const options = RepeatOptions.map((arr) => ({
            value: arr[0],
            label: arr[1],
        }));

        return (
            <RepeatContainer>
                <div>
                    <MuiSelectNative<RepeatOption | null>
                        label="Repeat"
                        isNullable={true}
                        onChange={({value}: {value: RepeatOption}) =>
                            this.setState({repeat: value})
                        }
                        value={options.find(
                            (o) => o.value === this.state.repeat,
                        )}
                        options={options}
                    />
                </div>
                <div>
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
                </div>
            </RepeatContainer>
        );
    }

    render() {
        return (
            <div>
                <div style={boxStyle}>{this.renderDescription()}</div>
                <div style={boxStyle}>{this.renderAccount()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>{this.renderCategories()}</div>
                <div style={boxStyle}>{this.renderChargedPersons()}</div>
                <div style={boxStyle}>{this.renderRepeat()}</div>
                <TypeStatusFlagsContainer>
                    <div>{this.renderType()}</div>
                    <div>{this.renderStatus()}</div>
                    <div>{this.renderFlags()}</div>
                </TypeStatusFlagsContainer>
            </div>
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
                    <FormControlLabelInline
                        value="withdrawal"
                        control={<Radio color="primary" />}
                        label="Withdrawal"
                    />
                    <FormControlLabelInline
                        value="deposit"
                        control={<Radio color="primary" />}
                        label="Deposit"
                    />
                </RadioGroup>
            </>
        );
    }

    handleChangeType = (event) => {
        this.setState({type: event.target.value});
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
                    <FormControlLabelInline
                        value={TransactionStatus.draft}
                        control={<Radio color="primary" />}
                        label="Draft"
                    />
                    <FormControlLabelInline
                        value={TransactionStatus.pending}
                        control={<Radio color="primary" />}
                        label="Pending"
                    />
                    <FormControlLabelInline
                        value={TransactionStatus.finished}
                        control={<Radio color="primary" />}
                        label="Posted"
                    />
                </RadioGroup>
            </>
        );
    }

    handleChangeStatus = (event) => {
        this.setState({status: event.target.value});
    };
}

export const ExpenseForm = (ownProps) => {
    const stateProps = useSelector(
        ({
            currencies,
            preferences,
            categories,
            moneyLocations,
            user,
        }: GlobalState) => ({
            currencies,
            categories,
            preferences,
            moneyLocations,
            user,
        }),
    );

    return <ExpenseFormWrapped {...ownProps} {...stateProps} />;
};

const TypeStatusFlagsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: ${spacingLarge};

    @media ${screenQuerySmall} {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: ${spacingSmall};
    }
`;

const SumContainer = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
`;

const RepeatContainer = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
`;
