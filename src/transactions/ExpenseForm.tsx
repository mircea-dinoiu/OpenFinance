import {
    Avatar,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputAdornment,
    List,
    ListSubheader,
    Radio,
    RadioGroup,
    TextField,
    ListItem,
    ListItemAvatar,
    Divider,
} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {Autocomplete} from '@material-ui/lab';
import {KeyboardDateTimePicker} from '@material-ui/pickers';
import {TransactionAmountFields} from 'transactions/TransactionAmountFields';
import {TransactionCategoriesField} from 'transactions/TransactionCategoriesField';
import {TransactionNameField} from 'transactions/TransactionNameField';
import {TransactionStockFields} from 'transactions/TransactionStockFields';
import {TransactionStatus} from 'transactions/defs';
import {TAccount, Accounts, AccountType} from 'accounts/defs';
import {TCategories} from 'categories/defs';
import {TCurrencyMap} from 'currencies/defs';
import {TInventory} from 'inventories/defs';
import {TBootstrap, TUser} from 'users/defs';
import {advanceRepeatDate} from 'transactions/repeatedModels';
import {locales} from 'app/locales';
import {sortBy, orderBy} from 'lodash';

import React, {PureComponent, ReactNode} from 'react';
import {useSelector} from 'react-redux';
import {useInventories} from 'inventories/state';
import {GlobalState} from 'app/state/defs';
import {useSelectedProject} from 'projects/state';
import {useEndDate} from 'app/dates/helpers';
import {TransactionForm} from './form';
import {RepeatOption} from './RepeatOption';
import {TTransactionsContext} from 'transactions/TransactionsContext';

type TypeOwnProps = {
    initialValues: TransactionForm;
    onFormChange: (form: TransactionForm) => void;
    onSubmit: () => void;
    fieldToEdit?: TTransactionsContext['state']['fieldToEdit'];
};

type Props = TypeOwnProps & {
    moneyLocations: Accounts;
    currencies: TCurrencyMap;
    endDate: string;
    user: TBootstrap;
    categories: TCategories;
    inventories: TInventory[];
    users: TUser[];
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
                onChangeQuantity={(quantity) => this.setState({quantity})}
                onChangePrice={(price) => this.setState({price})}
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
                <Autocomplete<TAccount, false, true>
                    options={orderBy(this.props.moneyLocations, ['status', 'name'], ['desc', 'asc'])}
                    getOptionLabel={(o) => o.name}
                    disableClearable={true}
                    groupBy={(option) => option.status.toLocaleUpperCase()}
                    // @ts-ignore
                    onChange={(e: unknown, value: TAccount) => this.setState({paymentMethod: value.id as number})}
                    value={this.props.moneyLocations.find((inv) => inv.id === this.state.paymentMethod)}
                    renderInput={(params) => <TextField {...params} label="Account" InputLabelProps={{shrink: true}} />}
                />
            </FormControl>
        );
    }

    renderInventory() {
        return (
            <FormControl fullWidth={true}>
                <Autocomplete<TInventory>
                    options={this.props.inventories}
                    getOptionLabel={(o) => o.name}
                    onChange={(e: unknown, value: TInventory | null) => this.setState({inventoryId: value?.id ?? null})}
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

        return (
            <List
                subheader={
                    <ListSubheader disableGutters={true} disableSticky={true}>
                        Person(s)
                    </ListSubheader>
                }
            >
                {sortedUsers.map((user) => {
                    return (
                        <>
                            <ListItem
                                key={user.id}
                                button
                                selected={chargedPersons[user.id] === 100}
                                onClick={() =>
                                    this.setState({
                                        chargedPersons: sortedUsers.reduce((acc, u) => {
                                            return {
                                                ...acc,
                                                [u.id]: user.id === u.id ? 100 : 0,
                                            };
                                        }, {}),
                                    })
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar alt={user.full_name} src={user.avatar} />
                                </ListItemAvatar>
                                {user.full_name}
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    );
                })}
                <ListItem
                    button
                    selected={Object.values(chargedPersons).every((v) => v !== 100)}
                    onClick={() =>
                        this.setState({
                            chargedPersons: sortedUsers.reduce((acc, u) => {
                                return {
                                    ...acc,
                                    [u.id]: 100 / sortedUsers.length,
                                };
                            }, {}),
                        })
                    }
                >
                    <ListItemAvatar>
                        <></>
                    </ListItemAvatar>
                    All
                </ListItem>
                <br />
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
                <div>
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

    renderField(field: TypeOwnProps['fieldToEdit'], children: ReactNode) {
        const {fieldToEdit} = this.props;

        if (!fieldToEdit || fieldToEdit === field) {
            return children;
        }

        return null;
    }

    render() {
        const {fieldToEdit} = this.props;

        return (
            <ExpenseFormStyled
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.keyCode === 13 && this.props.onSubmit) {
                        this.props.onSubmit();
                    }
                }}
            >
                {this.renderField(
                    'description',
                    <TransactionNameField
                        value={this.state.description}
                        onChange={(description) => this.setState({description: description})}
                    />,
                )}
                {this.renderField(
                    'description',
                    <TextField
                        multiline
                        fullWidth={true}
                        label="Notes"
                        value={this.state.notes}
                        onChange={(e) => this.setState({notes: e.target.value})}
                    />,
                )}
                {this.renderField('paymentMethod', this.renderAccount())}
                {this.renderField('inventoryId', this.renderInventory())}
                {this.renderField('price', this.renderSum())}
                {this.renderStockFields()}
                {!fieldToEdit && (
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
                )}
                {this.renderField('date', this.renderDateTime())}

                {this.renderField(
                    'categories',
                    <TransactionCategoriesField
                        values={this.state.categories}
                        description={this.state.description}
                        onChange={(categories) => this.setState({categories: categories})}
                    />,
                )}
                {this.renderField('chargedPersons', this.renderChargedPersons())}
                {this.renderField('repeat', this.renderRepeat())}
                {!fieldToEdit && (
                    <TypeStatusFlagsContainer>
                        <div>{this.renderStatus()}</div>
                        <div>{this.renderFlags()}</div>
                    </TypeStatusFlagsContainer>
                )}
            </ExpenseFormStyled>
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
    const inventories = useInventories().data;

    return (
        <ExpenseFormWrapped {...ownProps} {...stateProps} inventories={inventories} endDate={endDate} users={users} />
    );
};

const ExpenseFormStyled = styled('div')(({theme}) => ({
    width: '100%',
    maxWidth: 'min(100vw, 700px)',
    display: 'grid',
    gridGap: theme.spacing(2),
    gridAutoFlow: 'row',
}));

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
