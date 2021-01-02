import {
    Avatar,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    InputLabel,
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
import Select from '@material-ui/core/Select';
import {DateTimePicker} from '@material-ui/pickers';
// @ts-ignore
import {MuiSelectNative} from 'components/dropdowns';
import {TransactionAmountFields} from 'components/transactions/TransactionAmountFields';
import {TransactionCategoriesField} from 'components/transactions/TransactionCategoriesField';
import {TransactionNameField} from 'components/transactions/TransactionNameField';
import {TransactionStockFields} from 'components/transactions/TransactionStockFields';
import {TransactionForm} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import {RepeatOptions} from 'defs/repeatOptions';
import {gridGap, screenQuerySmall, spacingLarge, spacingSmall} from 'defs/styles';
import {PERC_MAX, PERC_STEP, RepeatOption} from 'js/defs';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import {sumArray} from 'js/utils/numbers';
import {sortBy, groupBy, startCase} from 'lodash';

import React, {PureComponent} from 'react';
import {useSelector} from 'react-redux';
import {AccountStatus, AccountType} from 'state/accounts';
import {useSelectedProject} from 'state/projects';
import styled from 'styled-components';
import {Accounts, Bootstrap, Categories, CurrencyMap, GlobalState, User} from 'types';
import {useEndDate} from 'utils/dates';

const boxStyle = {
    padding: '10px 0',
};

type TypeOwnProps = {
    initialValues: TransactionForm;
    onFormChange: (form: TransactionForm) => void;
    onSubmit: () => void;
};

type Props = TypeOwnProps & {
    moneyLocations: Accounts;
    currencies: CurrencyMap;
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

        while ((diffToMax = PERC_MAX - sumArray(Object.values(nextChargedPersons)))) {
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
            | ((prevState: Readonly<State>, props: Readonly<Props>) => Pick<State, K> | State | null)
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
                balanceOffset={this.props.initialValues.sum}
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
        return (
            <FormControl fullWidth={true}>
                <InputLabel>Account</InputLabel>

                <Select
                    native
                    onChange={(e) => this.setState({paymentMethod: e.target.value as number})}
                    value={this.state.paymentMethod}
                >
                    {sortBy(Object.entries(groupBy(this.props.moneyLocations, 'status')), (e) =>
                        Object.values(AccountStatus).indexOf(e[0] as AccountStatus),
                    ).map(([status, accounts]) => {
                        return (
                            accounts.length > 0 && (
                                <optgroup label={startCase(status)}>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </optgroup>
                            )
                        );
                    })}
                </Select>
            </FormControl>
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
                                <Avatar style={{margin: 0}} alt={user.full_name} src={user.avatar} />
                            </ListItemAvatar>

                            <Slider
                                value={chargedPersons[id] || 0}
                                valueLabelFormat={(value) => `${value}%`}
                                step={step}
                                marks={true}
                                onChange={(event, value) =>
                                    this.setState(
                                        setChargedPersonValueFactory(id, value as number, {
                                            userIdsStringified,
                                        }),
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
                    <TextField
                        label="Frequency"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.repeatFactor}
                        fullWidth={true}
                        type="number"
                        margin="none"
                        style={{
                            marginTop: '2px',
                        }}
                        onChange={(event) => {
                            this.setState({
                                repeatFactor: Number(event.target.value),
                            });
                        }}
                    />
                </div>
                <div>
                    <MuiSelectNative<RepeatOption | null>
                        label=" "
                        isNullable={true}
                        onChange={({value}) => this.setState({repeat: value})}
                        value={options.find((o) => o.value === this.state.repeat)}
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
                                repeatOccurrences: Number(event.target.value),
                            });
                        }}
                        InputProps={
                            this.state.repeat
                                ? {
                                      endAdornment: (
                                          <InputAdornment position="end">
                                              Ends on{' '}
                                              {advanceRepeatDate(
                                                  {
                                                      created_at: this.state.date,
                                                      repeat: this.state.repeat,
                                                      repeat_factor: this.state.repeatFactor,
                                                  },
                                                  this.state.repeatOccurrences,
                                              )
                                                  .toDate()
                                                  .toLocaleDateString()}
                                          </InputAdornment>
                                      ),
                                  }
                                : {}
                        }
                        disabled={this.state.repeat == null}
                    />
                </div>
            </RepeatContainer>
        );
    }

    renderStockFields() {
        const accountType = this.props.moneyLocations.find((ml) => ml.id === Number(this.state.paymentMethod))?.type;

        return (
            accountType === AccountType.BROKERAGE && (
                <div style={boxStyle}>
                    <TransactionStockFields
                        values={{
                            stockUnits: this.state.stockUnits,
                            stockId: this.state.stockId,
                        }}
                        onChange={(values) => this.setState({...values})}
                    />
                </div>
            )
        );
    }

    render() {
        return (
            <div
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.keyCode === 13 && this.props.onSubmit) {
                        this.props.onSubmit();
                    }
                }}
            >
                <div style={boxStyle}>
                    <TransactionNameField
                        value={this.state.description}
                        onChange={(description) => this.setState({description: description})}
                    />
                </div>
                <div style={boxStyle}>
                    <TextField
                        multiline
                        fullWidth={true}
                        label="Notes"
                        value={this.state.notes}
                        onChange={(e) => this.setState({notes: e.target.value})}
                    />
                </div>
                <div style={boxStyle}>{this.renderAccount()}</div>
                <div style={boxStyle}>{this.renderSum()}</div>
                {this.renderStockFields()}
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
                                weight: event.target.value ? Number(event.target.value) : null,
                            })
                        }
                    />
                </div>
                <div style={boxStyle}>{this.renderDateTime()}</div>
                <div style={boxStyle}>
                    <TransactionCategoriesField
                        values={this.state.categories}
                        description={this.state.description}
                        onChange={(categories) => this.setState({categories: categories})}
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
    const stateProps = useSelector(({currencies, categories, moneyLocations, user}: GlobalState) => ({
        currencies,
        categories,
        moneyLocations,
        user,
    }));
    const [endDate] = useEndDate();
    const users = useSelectedProject().users;

    return <ExpenseFormWrapped {...ownProps} {...stateProps} endDate={endDate} users={users} />;
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
    grid-template-columns: 1fr 1fr 1fr;
`;
