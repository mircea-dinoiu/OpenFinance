import {
    Avatar,
    Checkbox,
    FormControl,
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
import {styled} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {KeyboardDateTimePicker} from '@material-ui/pickers';
import {TransactionAmountFields} from 'components/transactions/TransactionAmountFields';
import {TransactionCategoriesField} from 'components/transactions/TransactionCategoriesField';
import {TransactionNameField} from 'components/transactions/TransactionNameField';
import {TransactionStockFields} from 'components/transactions/TransactionStockFields';
import {TransactionForm} from 'components/transactions/types';
import {Account, Accounts, AccountType} from 'domain/accounts/defs';
import {Categories} from 'domain/categories/defs';
import {CurrencyMap} from 'domain/currencies/defs';
import {Inventory} from 'domain/inventories/defs';
import {Bootstrap, User} from 'domain/users/defs';
import {PERC_MAX, PERC_STEP, RepeatOption} from 'js/defs';
import {advanceRepeatDate} from 'js/helpers/repeatedModels';
import {sumArray} from 'js/utils/numbers';
import {locales} from 'locales';
import {sortBy} from 'lodash';

import React, {PureComponent} from 'react';
import {useSelector} from 'react-redux';
import {useInventories} from 'domain/inventories/state';
import {GlobalState} from 'app/state/defs';
import {useSelectedProject} from 'app/state/projects';
import {useEndDate} from 'app/dates/helpers';
import {TransactionStatus} from 'transactions/defs';

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
    inventories: Inventory[];
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

const FormControlLabelInline = styled(FormControlLabel)({
    display: 'inline-block',
});

type State = TransactionForm;

const MIN_REPEAT_OCCURRENCES = 2;

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
                values={this.state}
                onChange={(values) => this.setState(values)}
            />
        );
    }

    renderDateTime() {
        return (
            <KeyboardDateTimePicker
                label="Date & Time"
                value={this.state.date}
                onChange={(value) => this.setState({date: value})}
                showTodayButton
                style={{width: '100%'}}
                ampm={false}
                format="YYYY-MM-DD HH:mm"
            />
        );
    }

    renderAccount() {
        return (
            <FormControl fullWidth={true}>
                <Autocomplete<Account>
                    options={this.props.moneyLocations}
                    getOptionLabel={(o) => o.name}
                    disableClearable={true}
                    groupBy={(option) => option.status.toLocaleUpperCase()}
                    // @ts-ignore
                    onChange={(e: unknown, value: Account) => this.setState({paymentMethod: value.id as number})}
                    value={this.props.moneyLocations.find((inv) => inv.id === this.state.paymentMethod)}
                    renderInput={(params) => <TextField {...params} label="Account" InputLabelProps={{shrink: true}} />}
                />
            </FormControl>
        );
    }

    renderInventory() {
        return (
            <FormControl fullWidth={true}>
                <Autocomplete<Inventory>
                    options={this.props.inventories}
                    getOptionLabel={(o) => o.name}
                    onChange={(e: unknown, value: Inventory | null) => this.setState({inventoryId: value?.id ?? null})}
                    value={this.props.inventories.find((inv) => inv.id === this.state.inventoryId)}
                    renderInput={(params) => (
                        <TextField {...params} label="Inventory" InputLabelProps={{shrink: true}} />
                    )}
                />
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
        const options = Object.values(RepeatOption).map((value) => ({
            value: value,
            label: locales.repeatOptions[value],
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
                    <Autocomplete<typeof options[0]>
                        renderInput={(params) => (
                            <TextField {...params} label="Time Unit" InputLabelProps={{shrink: true}} />
                        )}
                        onChange={(e: unknown, o: typeof options[0] | null) =>
                            this.setState({repeat: o?.value ?? null})
                        }
                        value={options.find((o) => o.value === this.state.repeat)}
                        options={options}
                        getOptionLabel={(o) => o.label}
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
                                repeatOccurrences: event.target.value.trim() === '' ? null : Number(event.target.value),
                            });
                        }}
                        onBlur={() => {
                            this.setState((state) => ({
                                repeatOccurrences:
                                    state.repeatOccurrences === null
                                        ? null
                                        : Math.max(state.repeatOccurrences, MIN_REPEAT_OCCURRENCES),
                            }));
                        }}
                        InputProps={
                            this.state.repeat &&
                            this.state.repeatOccurrences !== null &&
                            this.state.repeatOccurrences >= MIN_REPEAT_OCCURRENCES
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
                                                  this.state.repeatOccurrences - 1,
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
                <div style={boxStyle}>{this.renderInventory()}</div>
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
    const stateProps = useSelector(({currencies, categories, moneyLocations, inventories, user}: GlobalState) => ({
        currencies,
        categories,
        moneyLocations,
        user,
    }));
    const [endDate] = useEndDate();
    const users = useSelectedProject().users;
    const inventories = useInventories().data;

    return (
        <ExpenseFormWrapped {...ownProps} {...stateProps} inventories={inventories} endDate={endDate} users={users} />
    );
};

const TypeStatusFlagsContainer = styled('div')(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 1fr',
        gridGap: theme.spacing(1),
    },
}));

const RepeatContainer = styled('div')(({theme}) => ({
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr 1fr',
}));
