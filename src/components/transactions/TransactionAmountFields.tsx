import {InputAdornment, TextField, TextFieldProps} from '@material-ui/core';
import {TransactionForm} from 'components/transactions/types';
import {findCurrencyById} from 'domain/currencies/helpers';
import React from 'react';
import {useAccounts} from 'state/accounts';
import {useCurrenciesMap} from 'domain/currencies/state';
import {styled} from '@material-ui/core/styles';

export const TransactionAmountFields = ({
    accountId,
    values: {price, quantity},
    onChange,
}: {
    accountId: number;
    values: Pick<TransactionForm, 'price' | 'quantity'>;
    onChange: (values: Pick<TransactionForm, 'price' | 'quantity'>) => void;
}) => {
    const accounts = useAccounts();
    const currencies = useCurrenciesMap();

    const currencyId = accounts.find((each) => each.id == accountId)?.currency_id;
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

    return (
        <TransactionAmountFieldsStyled>
            <TextField
                {...fieldProps}
                label="Price"
                InputProps={{
                    startAdornment,
                }}
                value={price}
                onChange={(event) =>
                    onChange({
                        quantity,
                        price: (event.target.value.replace('-', '') as any) as number,
                    })
                }
            />
            <TextField
                {...fieldProps}
                label="Quantity"
                value={quantity}
                onChange={(event) =>
                    onChange({
                        price,
                        quantity: (event.target.value as any) as number,
                    })
                }
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
};

const TransactionAmountFieldsStyled = styled('div')((props) => ({
    display: 'grid',
    gridGap: props.theme.spacing(2),
    gridTemplateColumns: 'repeat(3, 1fr)',
    alignItems: 'center',
}));
