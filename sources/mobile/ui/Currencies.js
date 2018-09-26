// @flow
import { SingleSelect } from 'common/components/Select';
import React, { PureComponent } from 'react';
import { MenuItem, Subheader } from 'material-ui';
import { fetchCurrencies, setBaseCurrencyId } from 'common/state/actions';
import { connect } from 'react-redux';

type TypeProps = {
    user: TypeUsers,
    currencies: TypeCurrencies,
    fetchCurrencies: typeof fetchCurrencies,
    setBaseCurrencyId: setBaseCurrencyId,
};

class Currencies extends PureComponent<TypeProps> {
    interval = null;

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.user) {
                this.props.fetchCurrencies({ update: true });
            }
        }, 60 * 60 * 1000);
    }

    componentWillUnmount() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    handleChangeBaseCurrency = (id: number) => {
        this.props.setBaseCurrencyId(id);
    };

    render() {
        const map = this.props.currencies.map;
        const defaultCurrencyId = this.props.currencies.default;
        const defaultCurrency = map[defaultCurrencyId];

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
                        onChange={this.handleChangeBaseCurrency}
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
    }
}

export default connect(
    ({ user, currencies }) => ({ user, currencies }),
    { fetchCurrencies, setBaseCurrencyId },
)(Currencies);
