import React, {PureComponent} from 'react';
import {MenuItem, Subheader} from 'material-ui';

export default class Currencies extends PureComponent {
    render() {
        const map = this.props.data.get('map');
        const defaultCurrencyId = this.props.data.get('default');
        const defaultCurrency = map.get(String(defaultCurrencyId));

        return (
            <div>
                <Subheader>
                    Exchange Rates
                </Subheader>
                {map.toArray().map(each => (
                    each.get('id') !== defaultCurrencyId && (
                        <MenuItem key={each.get('id')}>
                            <strong>{each.get('iso_code')}</strong>: {
                            each.getIn(['rates', defaultCurrency.get('iso_code')])
                        } <i>{defaultCurrency.get('symbol')}</i>
                        </MenuItem>
                    )
                ))}
            </div>
        );
    }
}