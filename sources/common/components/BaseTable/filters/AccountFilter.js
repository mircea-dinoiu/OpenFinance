// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import { connect } from 'react-redux';

const mapStateToProps = ({ moneyLocations }) => ({
    items: moneyLocations.toJS(),
});

const ConnectedFilter = connect(mapStateToProps)(SelectFilter);

const AccountFilter = ({ onChange, filter }) => (
    <ConnectedFilter onChange={onChange} filter={filter} allowNone={false} />
);

export default AccountFilter;
