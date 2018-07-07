// @flow
import React from 'react';
import DescriptionDisplay from 'common/components/FinancialTable/cells/DescriptionDisplay';
import AmountColumn from 'common/components/FinancialTable/columns/AmountColumn';
import DateTimeColumn from 'common/components/FinancialTable/columns/DateTimeColumn';
import CategoriesDisplay from 'mobile/ui/internal/expenses/cells/CategoriesDisplay';
import AccountColumn from 'common/components/FinancialTable/columns/AccountColumn';
import PersonsDisplay from 'mobile/ui/internal/expenses/cells/PersonsDisplay';
import CurrencyColumn from 'common/components/FinancialTable/columns/CurrencyColumn';
import RepeatColumn from 'common/components/FinancialTable/columns/RepeatColumn';

export default [
    CurrencyColumn,
    AmountColumn,
    {
        Header: 'Description',
        accessor: (item) => (
            <DescriptionDisplay entity="expense" item={item} accessor="item" />
        ),
        id: 'description',
    },
    DateTimeColumn,
    {
        Header: 'Categories',
        accessor: (item) => <CategoriesDisplay item={item} />,
        id: 'categories',
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
    },
    RepeatColumn,
];
