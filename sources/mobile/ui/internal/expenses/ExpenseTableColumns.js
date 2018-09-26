// @flow
import React from 'react';
import DescriptionDisplay from 'common/components/BaseTable/cells/DescriptionDisplay';
import AmountColumn from 'common/components/BaseTable/columns/AmountColumn';
import DateTimeColumn from 'common/components/BaseTable/columns/DateTimeColumn';
import CategoriesDisplay from 'mobile/ui/internal/expenses/cells/CategoriesDisplay';
import AccountColumn from 'common/components/BaseTable/columns/AccountColumn';
import PersonsDisplay from 'mobile/ui/internal/expenses/cells/PersonsDisplay';
import RepeatColumn from 'common/components/BaseTable/columns/RepeatColumn';
import DescriptionFilter, {
    filterMethod as descriptionFilterMethod,
} from 'common/components/BaseTable/filters/DescriptionFilter';

export default [
    AmountColumn,
    {
        Header: 'Description',
        filterable: false,
        filterMethod: descriptionFilterMethod,
        Filter: DescriptionFilter,
        accessor: (item) => (
            <DescriptionDisplay entity="expense" item={item} accessor="item" />
        ),
        id: 'item',
    },
    DateTimeColumn,
    {
        Header: 'Categories',
        accessor: (item) => <CategoriesDisplay item={item} />,
        id: 'categories',
        sortable: false,
    },
    AccountColumn,
    {
        Header: 'Person(s)',
        accessor: (item) => <PersonsDisplay item={item} />,
        id: 'persons',
        //
        width: 100,
        style: { textAlign: 'center' },
        headerStyle: { textAlign: 'center' },
        sortable: false,
    },
    RepeatColumn,
];
