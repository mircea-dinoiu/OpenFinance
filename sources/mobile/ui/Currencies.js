// @flow
import React, { PureComponent } from 'react';
import { MenuItem, Subheader } from 'material-ui';
import { fetchCurrencies } from 'common/state/actions';
import { connect } from 'react-redux';

type TypeProps = {
    user: TypeUsers,
    data: TypeCurrencies,
    fetchCurrencies: typeof fetchCurrencies,
};

class Currencies extends PureComponent<TypeProps> {
    interval = null;

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.user) {
                this.props.fetchCurrencies({ update: true });
            }
        }, 60 * 1000);
    }

    componentWillUnmount() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    render() {
        const map = this.props.data.get('map');
        const defaultCurrencyId = this.props.data.get('default');
        const defaultCurrency = map.get(String(defaultCurrencyId));

        return (
            <div>
                <Subheader>Exchange Rates</Subheader>
                {map.toArray().map(
                    (each) =>
                        each.get('id') !== defaultCurrencyId && (
                            <MenuItem key={each.get('id')}>
                                <strong>{each.get('iso_code')}</strong>:{' '}
                                {each.getIn([
                                    'rates',
                                    defaultCurrency.get('iso_code'),
                                ])}{' '}
                                <i>{defaultCurrency.get('symbol')}</i>
                            </MenuItem>
                        ),
                )}
            </div>
        );
    }
}

export default connect(
    ({ user }) => ({ user }),
    { fetchCurrencies },
)(Currencies);
