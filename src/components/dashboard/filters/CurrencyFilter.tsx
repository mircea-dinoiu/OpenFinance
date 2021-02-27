import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@material-ui/core';
import React from 'react';
import {useCurrenciesMap} from 'state/currencies';
import {sortBy} from 'lodash';

export const CurrencyFilter = <Id extends number | string>({
    ids,
    selected,
    onChange,
}: {
    ids: Id[];
    selected: Id;
    onChange: (id: Id) => void;
}) => {
    const currenciesMap = useCurrenciesMap();

    return (
        <FormControl>
            <FormLabel>Currency</FormLabel>
            <RadioGroup value={String(selected)} onChange={(e) => onChange(e.target.value as Id)}>
                {sortBy(
                    ids.map((currencyId) => currenciesMap[currencyId as string]),
                    'iso_code',
                ).map((currency) => (
                    <FormControlLabel value={String(currency.id)} control={<Radio />} label={currency.iso_code} />
                ))}
            </RadioGroup>
        </FormControl>
    );
};
