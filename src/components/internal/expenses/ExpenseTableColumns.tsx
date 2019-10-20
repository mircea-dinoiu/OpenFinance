import CurrencyDisplay from 'components/BaseTable/cells/CurrencyDisplay';
import PricePerGDisplay from 'components/BaseTable/cells/PricePerGDisplay';
import CategoriesFilter from 'components/BaseTable/filters/CategoriesFilter';
import {TypeTransactionModel} from 'types';
import * as React from 'react';
import DescriptionDisplay from 'components/BaseTable/cells/DescriptionDisplay';
import AmountColumn from 'components/BaseTable/columns/AmountColumn';
import DateTimeColumn from 'components/BaseTable/columns/DateTimeColumn';
import WeightDisplay from 'components/internal/expenses/cells/WeightDisplay';
import CategoriesDisplay from 'components/internal/expenses/cells/CategoriesDisplay';
import AccountColumn from 'components/BaseTable/columns/AccountColumn';
import PersonsDisplay from 'components/internal/expenses/cells/PersonsDisplay';
import RepeatColumn from 'components/BaseTable/columns/RepeatColumn';
import DescriptionFilter from 'components/BaseTable/filters/DescriptionFilter';
import UsersFilter from 'components/BaseTable/filters/UsersFilter';
import RatingDisplay from 'components/internal/expenses/cells/RatingDisplay';

export default ({updateRecords}) => [
    AmountColumn,
    {
        Header: '$',
        filterable: false,
        sortable: true,
        accessor: (item: TypeTransactionModel) => (
            <CurrencyDisplay item={item} />
        ),
        id: 'money_location.currency_id',
        width: 40,
    },
    {
        Header: 'Description',
        filterable: true,
        Filter: DescriptionFilter,
        accessor: (item: TypeTransactionModel) => (
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
        accessor: (item: TypeTransactionModel) => (
            <CategoriesDisplay item={item} />
        ),
        id: 'categories',
        sortable: false,
    },
    AccountColumn,
    {
        Header: 'Person(s)',
        accessor: (item: TypeTransactionModel) => (
            <PersonsDisplay item={item} />
        ),
        Filter: UsersFilter,
        filterable: true,
        id: 'users',
        //
        width: 100,
        style: {textAlign: 'center'},
        headerStyle: {textAlign: 'center'},
        sortable: false,
    },
    {
        Header: 'Rating',
        filterable: true,
        sortable: true,
        accessor: (item: TypeTransactionModel) => (
            <RatingDisplay item={item} updateRecords={updateRecords} />
        ),
        id: 'favorite',
        //
        width: 120,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
    },
    {
        Header: 'Weight (g)',
        filterable: true,
        accessor: (item: TypeTransactionModel) => <WeightDisplay item={item} />,
        id: 'weight',
        //
        width: 110,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'right'},
    },
    {
        Header: 'Price/g',
        sortable: true,
        accessor: (item: TypeTransactionModel) => (
            <PricePerGDisplay item={item} />
        ),
        id: 'sum_per_weight',
        //
        width: 100,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'right'},
    },
    RepeatColumn,
];
