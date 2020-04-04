import {MuiSelectNative} from 'components/dropdowns';
import React from 'react';
import {MenuItem, ListSubheader as Subheader} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {Currency} from 'types';
import {useUsers} from 'state/hooks';
import {
    fetchCurrencies,
    setCurrenciesSelectedId,
    useCurrencies,
} from 'state/currencies';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    main: {
        width: 250,
    },
});

export const CurrenciesDrawerContent = () => {
    const user = useUsers();
    const currencies = useCurrencies();
    const map = currencies;
    const defaultCurrencyId = currencies.selected.id;
    const defaultCurrency = map[String(defaultCurrencyId)];
    const dispatch = useDispatch();
    const cls = useStyles();

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (user) {
                dispatch(fetchCurrencies({update: true}));
            }
        }, 60 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [dispatch, user]);

    const options = Object.values(map).map((each: Currency) => ({
        value: each.id,
        label: each.iso_code,
    }));

    return (
        <div className={cls.main}>
            <Subheader>Base Currency</Subheader>
            <div
                style={{
                    padding: '0 15px',
                }}
            >
                <MuiSelectNative
                    options={options}
                    value={options.find((o) => o.value === defaultCurrencyId)}
                    onChange={({value}: {value: number}) => {
                        dispatch(setCurrenciesSelectedId(value));
                    }}
                />
            </div>

            <Subheader>Exchange Rates</Subheader>
            {Object.values(map).map(
                (each: Currency) =>
                    each.id !== defaultCurrencyId && (
                        <MenuItem key={each.id}>
                            <strong>{each.iso_code}</strong>:{' '}
                            {each.rates[defaultCurrency.iso_code]}
                        </MenuItem>
                    ),
            )}
        </div>
    );
};
