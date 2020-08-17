import {InputAdornment, TextField} from '@material-ui/core';
import {gridGap} from 'defs/styles';
import {findCurrencyById} from 'helpers/currency';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {useMoneyLocations} from 'state/hooks';
import {SummaryKey, useSummary} from 'state/summary';
import styled from 'styled-components';

export const TransactionAmountFields = ({
    accountId,
    value,
    onChange,
    balanceOffset,
}: {
    accountId: number;
    value: number;
    onChange: (value: number) => void;
    balanceOffset: number;
}) => {
    const accounts = useMoneyLocations();
    const currencies = useCurrenciesMap();
    const balanceByAccount = useSummary(SummaryKey.BALANCE_BY_ACCOUNT);
    const balance = (balanceByAccount?.[accountId] ?? 0) - balanceOffset;

    const currencyId = accounts.find((each) => each.id == accountId)
        ?.currency_id;
    const startAdornment = (
        <InputAdornment position="start">
            {accountId
                ? currencyId &&
                  findCurrencyById(currencyId, currencies).iso_code
                : ''}
        </InputAdornment>
    );

    return (
        <TransactionAmountFieldsStyled>
            <TextField
                label="Amount"
                InputProps={{
                    startAdornment,
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
                InputProps={{
                    startAdornment,
                }}
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
