// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {connect} from 'react-redux';
import {sortMoneyLocations} from 'mobile/ui/internal/common/helpers';

const mapStateToProps = ({moneyLocations}) => ({
    items: sortMoneyLocations(moneyLocations.toJS()),
});

const ConnectedFilter = connect(mapStateToProps)(SelectFilter);

const AccountFilter = ({onChange, filter}) => (
    <ConnectedFilter onChange={onChange} filter={filter} allowNone={false} />
);

export default AccountFilter;
