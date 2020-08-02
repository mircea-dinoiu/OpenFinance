import {
    Avatar,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
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
import {MuiSelectNative} from 'components/dropdowns';
import {TransactionAmountFields} from 'components/transactions/TransactionAmountFields';
import {TransactionCategoriesField} from 'components/transactions/TransactionCategoriesField';
import {TransactionNameField} from 'components/transactions/TransactionNameField';
import {TransactionForm} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import {RepeatOptions} from 'defs/repeatOptions';
import {
    gridGap,
    screenQuerySmall,
    spacingLarge,
    spacingSmall,
} from 'defs/styles';
import {PERC_MAX, PERC_STEP, RepeatOption} from 'js/defs';
import {sumArray} from 'js/utils/numbers';
import {sortBy} from 'lodash';

import React, {PureComponent} from 'react';
import {useSelector} from 'react-redux';
import {useSelectedProject} from 'state/projects';
import styled from 'styled-components';
import {
    Accounts,
    Bootstrap,
    Categories,
    Currencies,
    GlobalState,
    User,
} from 'types';
import {useEndDate} from 'utils/dates';

const boxStyle = {
    padding: '10px 0',
};

type TypeOwnProps = {
    initialValues: TransactionForm;
    onFormChange: (form: TransactionForm) => void;
};

type Props = TypeOwnProps & {
    moneyLocations: Accounts;
    currencies: Currencies;
    endDate: string;
    user: Bootstrap;
    categories: Categories;
    users: User[];
};

export const setChargedPersonValueFactory = (
    id: string,
    value: number,
    {
        userIdsStringified,
        adjust = true,
    }: {
        userIdsStringified: string[];
        adjust?: boolean;
    },
) => (prevState: Partial<State>) => {
    const step = PERC_STEP;
    const nextChargedPersons: Record<number, number> = {
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

class ExpenseFormWrapped extends PureComponent<Props, State> {
    state: State = {
        ...this.props.initialValues,
    };

    setState<K extends keyof State>(
        state:
            | ((
                  prevState: Readonly<State>,
                  props: Readonly<Props>,
              ) => Pick<State, K> | State | null)
            | (Pick<State, K> | State | null),
    ) {
        this.props.onFormChange({...this.state, ...state});

        return super.setState(state);
    }

    renderSum() {
        return (
            <TransactionAmountFields
                accountId={this.state.paymentMethod}
                value={this.state.sum}
                onChange={(value) => this.setState({sum: value})}
            />
        );
    }

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
                valueType="number"
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
        if (this.props.users.length < 2) {
            return null;
        }

        const sortedUsers = sortBy(this.props.users, (each) => each.full_name);
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
                                            value as number,
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
                        onChange={({value}) => this.setState({repeat: value})}
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
                        onChange={(event) => {
                            this.setState({
                                // @ts-ignore
                                repeatOccurrences: event.target.value,
                            });
                        }}
                        disabled={this.state.repeat == null}
                    />
                </div>
            </RepeatContainer>
        );
    }

    render() {
        return (
            <div>
                <div style={boxStyle}>
                    <TransactionNameField
                        value={this.state.description}
                        onChange={(description) =>
                            this.setState({description: description})
                        }
                    />
                </div>
                <div style={boxStyle}>{this.renderAccount()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                <div style={boxStyle}>
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
                            this.setState({
                                weight: event.target.value
                                    ? Number(event.target.value)
                                    : null,
                            })
                        }
                    />
                </div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>
                    <TransactionCategoriesField
                        values={this.state.categories}
                        description={this.state.description}
                        onChange={(categories) =>
                            this.setState({categories: categories})
                        }
                    />
                </div>
                <div style={boxStyle}>{this.renderChargedPersons()}</div>
                <div style={boxStyle}>{this.renderRepeat()}</div>
                <TypeStatusFlagsContainer>
                    <div>{this.renderStatus()}</div>
                    <div>{this.renderFlags()}</div>
                </TypeStatusFlagsContainer>
            </div>
        );
    }

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
                    onChange={(event) => {
                        this.setState({
                            status: event.target.value as TransactionStatus,
                        });
                    }}
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
}

export const ExpenseForm = (ownProps: TypeOwnProps) => {
    const stateProps = useSelector(
        ({currencies, categories, moneyLocations, user}: GlobalState) => ({
            currencies,
            categories,
            moneyLocations,
            user,
        }),
    );
    const [endDate] = useEndDate();
    const users = useSelectedProject().users;

    return (
        <ExpenseFormWrapped
            {...ownProps}
            {...stateProps}
            endDate={endDate}
            users={users}
        />
    );
};

const TypeStatusFlagsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: ${spacingLarge};

    @media ${screenQuerySmall} {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: ${spacingSmall};
    }
`;

const RepeatContainer = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
`;
