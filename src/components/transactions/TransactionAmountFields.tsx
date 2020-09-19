import {InputAdornment, TextField} from '@material-ui/core';
import {gridGap} from 'defs/styles';
import {findCurrencyById} from 'helpers/currency';
import {financialNum} from 'js/utils/numbers';
import React from 'react';
import {useAccounts} from 'state/accounts';
import {useCurrenciesMap} from 'state/currencies';
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
    const accounts = useAccounts();
    const currencies = useCurrenciesMap();
    const balanceByAccount = useSummary(SummaryKey.BALANCE_BY_ACCOUNT);
    const sumForSelectedAccount = balanceByAccount?.cash.find((c) => c.money_location_id === accountId);
    const cashForSelectedAccount = balanceByAccount?.stocks.find((c) => c.money_location_id === accountId);
    const balance = (sumForSelectedAccount?.sum ?? 0) - balanceOffset;

    const currencyId = accounts.find((each) => each.id == accountId)?.currency_id;
    const startAdornment = (
        <InputAdornment position="start">
            {accountId ? currencyId && findCurrencyById(currencyId, currencies).iso_code : ''}
        </InputAdornment>
    );

    return (
        <TransactionAmountFieldsStyled count={cashForSelectedAccount == null ? 2 : 1}>
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
                onChange={(event) => onChange((event.target.value as any) as number)}
            />
            {cashForSelectedAccount == null && (
                <TextField
                    tabIndex={-1}
                    InputProps={{
                        startAdornment,
                    }}
                    label="Future Balance (Based on Summary)"
                    value={financialNum(balance + Number(value || 0))}
                    onChange={(event) => {
                        onChange(financialNum(Number(event.target.value || 0) - balance));
                    }}
                />
            )}
        </TransactionAmountFieldsStyled>
    );
};

const TransactionAmountFieldsStyled = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: repeat(${(props: {count: number}) => props.count}, 1fr);
    align-items: center;
`;
