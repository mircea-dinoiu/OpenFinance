// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import {connect} from 'react-redux';

const mapStateToProps = ({user}) => ({items: user.toJS().list});

const ConnectedFilter = connect(mapStateToProps)(SelectFilter);

const UsersFilter = ({onChange, filter}) => (
    <ConnectedFilter
        onChange={onChange}
        filter={filter}
        multi={true}
        nameKey="full_name"
        allowNone={false}
    />
);

export default UsersFilter;
