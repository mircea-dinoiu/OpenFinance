// @flow
import CategoriesFilter from 'common/components/BaseTable/filters/CategoriesFilter';
import React from 'react';
import DescriptionDisplay from 'common/components/BaseTable/cells/DescriptionDisplay';
import AmountColumn from 'common/components/BaseTable/columns/AmountColumn';
import DateTimeColumn from 'common/components/BaseTable/columns/DateTimeColumn';
import WeightDisplay from 'mobile/ui/internal/expenses/cells/WeightDisplay';
import CategoriesDisplay from 'mobile/ui/internal/expenses/cells/CategoriesDisplay';
import AccountColumn from 'common/components/BaseTable/columns/AccountColumn';
import PersonsDisplay from 'mobile/ui/internal/expenses/cells/PersonsDisplay';
import RepeatColumn from 'common/components/BaseTable/columns/RepeatColumn';
import DescriptionFilter from 'common/components/BaseTable/filters/DescriptionFilter';
import UsersFilter from 'common/components/BaseTable/filters/UsersFilter';
import RatingDisplay from 'mobile/ui/internal/expenses/cells/RatingDisplay';

export default ({updateRecords}) => [
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
        width: 500,
    },
    DateTimeColumn,
    {
        Header: 'Categories',
        filterable: true,
        Filter: CategoriesFilter,
        accessor: (item) => <CategoriesDisplay item={item} />,
        id: 'categories',
        sortable: false,
        width: 200,
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
    {
        Header: 'Rating',
        filterable: true,
        sortable: true,
        accessor: (item, ...args) => {
            console.log(...args);

            return <RatingDisplay item={item} updateRecords={updateRecords} />;
        },
        id: 'favorite',
        //
        width: 110,
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
    },
    {
        Header: 'Weight',
        filterable: true,
        accessor: (item) => <WeightDisplay item={item} />,
        id: 'weight',
        //
        width: 130,
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'right' },
    },
    RepeatColumn
];
