import {ListSubheader as Subheader, MenuItem, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {MuiSelectNative} from 'components/dropdowns';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
    fetchCurrencies,
    useCurrencies,
    useCurrenciesMap,
} from 'state/currencies';
import {useBootstrap} from 'state/hooks';
import {Currency} from 'types';

const useStyles = makeStyles({
    main: {
        width: '100%',
    },
});

export const Currencies = () => {
    const user = useBootstrap();
    const currencies = useCurrenciesMap();

    if (user && currencies) {
        return <CurrenciesInner />;
    }

    return null;
};

const CurrenciesInner = () => {
    const user = useBootstrap();
    const currencies = useCurrencies();
    const {map} = currencies;
    const dispatch = useDispatch();
    const cls = useStyles();
    const firstCurrencyCode = Object.values(map)[0]?.iso_code;
    const [baseCurrencyCode, setBaseCurrencyCode] = useState(firstCurrencyCode);

    useEffect(() => {
        if (!baseCurrencyCode) {
            setBaseCurrencyCode(firstCurrencyCode);
        }
    }, [firstCurrencyCode]);

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
        value: each.iso_code,
        label: each.iso_code,
    }));

    return (
        <Paper className={cls.main}>
            <Subheader>Base Currency</Subheader>
            <div
                style={{
                    padding: '0 15px',
                }}
            >
                <MuiSelectNative
                    options={options}
                    value={options.find((o) => o.value === baseCurrencyCode)}
                    onChange={({value}) => {
                        setBaseCurrencyCode(value);
                    }}
                    valueType="string"
                />
            </div>

            <Subheader>
                Exchange Rates as of{' '}
                {new Date(currencies.date).toLocaleString()}
            </Subheader>
            {Object.values(map).map(
                (each: Currency) =>
                    each.iso_code !== baseCurrencyCode && (
                        <MenuItem key={each.id}>
                            <strong>{each.iso_code}</strong>:{' '}
                            {each.rates[baseCurrencyCode]}
                        </MenuItem>
                    ),
            )}
        </Paper>
    );
};
