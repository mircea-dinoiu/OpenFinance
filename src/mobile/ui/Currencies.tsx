import {SingleSelect} from 'common/components/Select';
import {objectValuesOfSameType} from 'common/utils/collection';
import React from 'react';
import {MenuItem, Subheader} from 'material-ui';
import {fetchCurrencies, setBaseCurrencyId} from 'common/state/actionCreators';
import {useDispatch} from 'react-redux';
import {TypeCurrency} from 'common/types';
import {useUser, useCurrencies} from 'common/state/hooks';

const Currencies = () => {
    const user = useUser();
    const currencies = useCurrencies();
    const map = currencies.map;
    const defaultCurrencyId = currencies.default;
    const defaultCurrency = map[String(defaultCurrencyId)];
    const dispatch = useDispatch();

    const handleChangeBaseCurrency = (id: number) => {
        dispatch(setBaseCurrencyId(id));
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
    }, []);

    return (
        <>
            <Subheader>Base Currency</Subheader>
            <div
                style={{
                    padding: '0 15px',
                }}
            >
                <SingleSelect
                    options={objectValuesOfSameType(map).map(
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
            {objectValuesOfSameType(map).map(
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

export default Currencies;
