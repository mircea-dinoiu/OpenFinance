import {InputAdornment, TextField, TextFieldProps} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {AccountType} from 'accounts/defs';
import {useAccounts} from 'accounts/state';
import {findCurrencyById} from 'currencies/helpers';
import {useCurrenciesMap} from 'currencies/state';
import React from 'react';
import {TransactionForm} from './form';

export const TransactionAmountFields = ({
    accountId,
    values: {price, quantity},
    onChangeQuantity,
    onChangePrice,
}: {
    accountId: number;
    values: Pick<TransactionForm, 'price' | 'quantity'>;
    onChangeQuantity: (quantity: number) => void;
    onChangePrice: (price: number) => void;
}) => {
    const accounts = useAccounts();
    const currencies = useCurrenciesMap();
    const account = accounts.find((each) => each.id == accountId);
    const accountIsBrokerage = account?.type === AccountType.BROKERAGE;
    const currencyId = account?.currency_id;
    const sign = quantity / Math.abs(quantity); // -1 or 1
    const startAdornment = (
        <InputAdornment position="start">
            {accountId ? currencyId && findCurrencyById(currencyId, currencies).iso_code : ''}
        </InputAdornment>
    );
    const fieldProps: TextFieldProps = {
        fullWidth: true,
        type: 'number',
        margin: 'none',
        style: {
            marginTop: '2px',
        },
    };

    if (accountIsBrokerage) {
        return (
            <TransactionAmountFieldsStyled>
                <TextField
                    {...fieldProps}
                    label="Quantity"
                    value={quantity}
                    onChange={(event) => onChangeQuantity((event.target.value as any) as number)}
                />
                <TextField
                    {...fieldProps}
                    label="Price"
                    InputProps={{
                        startAdornment,
                    }}
                    value={price}
                    onChange={(event) => onChangePrice((event.target.value.replace('-', '') as any) as number)}
                />
                <TextField
                    {...fieldProps}
                    label="Total"
                    InputProps={{
                        startAdornment,
                    }}
                    value={price * quantity}
                    disabled={true}
                />
            </TransactionAmountFieldsStyled>
        );
    }

    return (
        <TransactionAmountFieldsStyled>
            <ToggleButtonGroupStyled
                size="small"
                value={sign}
                exclusive
                onChange={(e, m) => typeof m === 'number' && onChangeQuantity(m)}
            >
                <ToggleButton value={-1}>Withdraw</ToggleButton>
                <ToggleButton value={1}>Deposit</ToggleButton>
            </ToggleButtonGroupStyled>
            <TextField
                {...fieldProps}
                label="Amount"
                InputProps={{
                    startAdornment,
                }}
                value={price}
                onChange={(event) => onChangePrice((event.target.value.replace('-', '') as any) as number)}
            />
        </TransactionAmountFieldsStyled>
    );
};

const TransactionAmountFieldsStyled = styled('div')((props) => ({
    display: 'grid',
    gridGap: props.theme.spacing(2),
    gridAutoFlow: 'column',
    alignItems: 'end',
}));

const ToggleButtonGroupStyled = styled(ToggleButtonGroup)({
    '& > *': {
        flex: 1,
    },
});
