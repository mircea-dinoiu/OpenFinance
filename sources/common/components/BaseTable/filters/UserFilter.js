// @flow
import React from 'react';
import SelectFilter from './SelectFilter';
import { connect } from 'react-redux';

const mapStateToProps = ({ user }) => ({
    items: user.toJS().list,
});

const ConnectedFilter = connect(mapStateToProps)(SelectFilter);

const UserFilter = ({ onChange, filter }) => (
    <ConnectedFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        nameKey="full_name"
    />
);

export default UserFilter;
