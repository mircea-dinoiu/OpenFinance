import {InputAdornment, TextField} from '@material-ui/core';
import {gridGap} from 'defs/styles';
import {findCurrencyById} from 'helpers/currency';
import React from 'react';
import {useCurrencies} from 'state/currencies';
import {useMoneyLocations} from 'state/hooks';
import {SummaryKey, useSummary} from 'state/summary';
import styled from 'styled-components';
import {financialNum} from 'js/utils/numbers';

export const TransactionAmountFields = ({
    accountId,
    value,
    onChange,
}: {
    accountId: number;
    value: number;
    onChange: (value: number) => void;
}) => {
    const accounts = useMoneyLocations();
    const currencies = useCurrencies();
    const balanceByAccount = useSummary(SummaryKey.BALANCE_BY_ACCOUNT);
    const balance = balanceByAccount?.[accountId] ?? 0;

    const currencyId = accounts.find((each) => each.id == accountId)
        ?.currency_id;

    return (
        <TransactionAmountFieldsStyled>
            <TextField
                label="Amount"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {accountId
                                ? currencyId &&
                                  findCurrencyById(currencyId, currencies)
                                      .iso_code
                                : ''}
                        </InputAdornment>
                    ),
                }}
                value={value}
                fullWidth={true}
                type="number"
                margin="none"
                style={{
                    marginTop: '2px',
                }}
                onChange={(event) =>
                    onChange((event.target.value as any) as number)
                }
            />
            <TextField
                tabIndex={-1}
                label="Future Balance (Based on Summary)"
                value={financialNum(balance + Number(value || 0))}
                onChange={(event) => {
                    onChange(
                        financialNum(Number(event.target.value || 0) - balance),
                    );
                }}
            />
        </TransactionAmountFieldsStyled>
    );
};

const TransactionAmountFieldsStyled = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
    align-items: center;
`;
