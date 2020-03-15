import {SingleSelect} from 'components/Select';
import React from 'react';
import {MenuItem, Subheader} from 'material-ui';
import {useDispatch} from 'react-redux';
import {TypeCurrency} from 'types';
import {useUsers} from 'state/hooks';
import {fetchCurrencies, setCurrenciesSelectedId, useCurrencies} from 'state/currencies';

export const Currencies = () => {
    const user = useUsers();
    const currencies = useCurrencies();
    const map = currencies;
    const defaultCurrencyId = currencies.selected.id;
    const defaultCurrency = map[String(defaultCurrencyId)];
    const dispatch = useDispatch();

    const handleChangeBaseCurrency = (id: number) => {
        dispatch(setCurrenciesSelectedId(id));
    };

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

    return (
        <>
            <Subheader>Base Currency</Subheader>
            <div
                style={{
                    padding: '0 15px',
                }}
            >
                <SingleSelect
                    options={Object.values(map).map(
                        (each: TypeCurrency) => ({
                            value: each.id,
                            label: each.iso_code,
                        }),
                    )}
                    value={defaultCurrencyId}
                    onChange={handleChangeBaseCurrency}
                />
            </div>

            <Subheader>Exchange Rates</Subheader>
            {Object.values(map).map(
                (each: TypeCurrency) =>
                    each.id !== defaultCurrencyId && (
                        <MenuItem key={each.id}>
                            <strong>{each.iso_code}</strong>:{' '}
                            {each.rates[defaultCurrency.iso_code]}
                        </MenuItem>
                    ),
            )}
        </>
    );
};
