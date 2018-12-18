// @flow
import CategoriesFilter from 'common/components/BaseTable/filters/CategoriesFilter';
import React from 'react';
import DescriptionDisplay from 'common/components/BaseTable/cells/DescriptionDisplay';
import AmountColumn from 'common/components/BaseTable/columns/AmountColumn';
import DateTimeColumn from 'common/components/BaseTable/columns/DateTimeColumn';
import CategoriesDisplay from 'mobile/ui/internal/expenses/cells/CategoriesDisplay';
import AccountColumn from 'common/components/BaseTable/columns/AccountColumn';
import PersonsDisplay from 'mobile/ui/internal/expenses/cells/PersonsDisplay';
import RepeatColumn from 'common/components/BaseTable/columns/RepeatColumn';
import DescriptionFilter from 'common/components/BaseTable/filters/DescriptionFilter';
import UsersFilter from 'common/components/BaseTable/filters/UsersFilter';

export default [
    AmountColumn,
    {
        Header: 'Description',
        filterable: true,
        Filter: DescriptionFilter,
        accessor: (item) => (
            <DescriptionDisplay
                entity="transaction"
                item={item}
                accessor="item"
            />
        ),
        id: 'item',
    },
    DateTimeColumn,
    {
        Header: 'Categories',
        filterable: true,
        Filter: CategoriesFilter,
        accessor: (item) => <CategoriesDisplay item={item} />,
        id: 'categories',
        sortable: false,
    },
    AccountColumn,
    {
        Header: 'Person(s)',
        accessor: (item) => <PersonsDisplay item={item} />,
        Filter: UsersFilter,
        filterable: true,
        id: 'users',
        //
        width: 100,
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
        sortable: false,
    },
    RepeatColumn,
];
