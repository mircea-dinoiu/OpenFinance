// @flow
import * as React from 'react';
import SelectFilter from './SelectFilter';
import { connect } from 'react-redux';

const mapStateToProps = ({ categories }) => ({ items: categories.toJS() });

const ConnectedFilter = connect(mapStateToProps)(SelectFilter);

const CategoriesFilter = ({ onChange, filter }) => (
    <ConnectedFilter onChange={onChange} filter={filter} multi={true} />
);

export default CategoriesFilter;
