import {DescriptionDisplay} from 'components/BaseTable/cells/DescriptionDisplay';
import {PricePerGDisplay} from 'components/BaseTable/cells/PricePerGDisplay';
import {AccountColumn} from 'components/BaseTable/columns/AccountColumn';
import {AmountColumn} from 'components/BaseTable/columns/AmountColumn';
import {DateTimeColumn} from 'components/BaseTable/columns/DateTimeColumn';
import {RepeatColumn} from 'components/BaseTable/columns/RepeatColumn';
import {CategoriesFilter} from 'components/BaseTable/filters/CategoriesFilter';
import {DescriptionFilter} from 'components/BaseTable/filters/DescriptionFilter';
import {UsersFilter} from 'components/BaseTable/filters/UsersFilter';
import {CategoriesDisplay} from 'components/transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'components/transactions/cells/PersonsDisplay';
import {RatingDisplay} from 'components/transactions/cells/RatingDisplay';
import {WeightDisplay} from 'components/transactions/cells/WeightDisplay';
import * as React from 'react';
import {TransactionModel} from 'types';

export const ExpenseTableColumns = ({updateRecords}) => [
    AmountColumn,
    {
        Header: 'Description',
        filterable: true,
        Filter: DescriptionFilter,
        accessor: (item: TransactionModel) => (
            <DescriptionDisplay
                entity="transaction"
                item={item}
                accessor="item"
            />
        ),
        id: 'item',
        minWidth: 300,
    },
    DateTimeColumn,
    {
        Header: 'Categories',
        filterable: true,
        Filter: CategoriesFilter,
        accessor: (item: TransactionModel) => (
            <CategoriesDisplay item={item} />
        ),
        id: 'categories',
        sortable: false,
        minWidth: 300,
    },
    AccountColumn,
    {
        Header: 'Person(s)',
        accessor: (item: TransactionModel) => (
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
        accessor: (item: TransactionModel) => (
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
        accessor: (item: TransactionModel) => <WeightDisplay item={item} />,
        id: 'weight',
        //
        width: 110,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'right'},
    },
    {
        Header: 'Price/g',
        sortable: true,
        accessor: (item: TransactionModel) => (
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
