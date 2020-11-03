import {DescriptionDisplay} from 'components/BaseTable/cells/DescriptionDisplay';
import {PricePerGDisplay} from 'components/BaseTable/cells/PricePerGDisplay';
import {AccountColumn} from 'components/BaseTable/columns/AccountColumn';
import {AmountColumn} from 'components/BaseTable/columns/AmountColumn';
import {DateTimeColumn} from 'components/BaseTable/columns/DateTimeColumn';
import {RepeatColumn} from 'components/BaseTable/columns/RepeatColumn';
import {CategoriesFilter} from 'components/BaseTable/filters/CategoriesFilter';
import {DescriptionFilter} from 'components/BaseTable/filters/DescriptionFilter';
import {StockSymbolFilter} from 'components/BaseTable/filters/StockSymbolFilter';
import {UsersFilter} from 'components/BaseTable/filters/UsersFilter';
import {NumericValue} from 'components/formatters';
import {CategoriesDisplay} from 'components/transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'components/transactions/cells/PersonsDisplay';
import {RatingDisplay} from 'components/transactions/cells/RatingDisplay';
import {WeightDisplay} from 'components/transactions/cells/WeightDisplay';
import {TransactionModel, UpdateRecords} from 'components/transactions/types';
import {numericColumnStyles} from 'defs/styles';
import * as React from 'react';
import {useStocksMap} from 'state/stocks';

export const makeTransactionsColumns = ({updateRecords}: {updateRecords: UpdateRecords}) => [
    AmountColumn,
    DescriptionColumn,
    DateTimeColumn,
    CategoriesColumn,
    AccountColumn,
    PersonsColumn,
    RepeatColumn,
    StockUnitsCol,
    StockSymbolCol,
    {
        ...RatingColumn,
        getProps: () => ({updateRecords}),
    },
    WeightColumn,
    PricePerWeightColumn,
];

const DescriptionColumn = {
    Header: 'Description',
    filterable: true,
    Filter: DescriptionFilter,
    Cell: ({original: item}: {original: TransactionModel}) => (
        <DescriptionDisplay entity="transaction" item={item} accessor="item" />
    ),
    accessor: 'item',
    minWidth: 300,
};

const CategoriesColumn = {
    Header: 'Categories',
    filterable: true,
    Filter: CategoriesFilter,
    Cell: ({original: item}: {original: TransactionModel}) => <CategoriesDisplay item={item} />,
    accessor: 'categories',
    sortable: false,
    minWidth: 300,
};

const PersonsColumn = {
    Header: 'Person(s)',
    Cell: ({original: item}: {original: TransactionModel}) => <PersonsDisplay item={item} />,
    Filter: UsersFilter,
    filterable: true,
    accessor: 'users',
    //
    width: 100,
    style: {textAlign: 'center'},
    headerStyle: {textAlign: 'center'},
    sortable: false,
};

const RatingColumn = {
    Header: 'Rating',
    filterable: true,
    sortable: true,
    Cell: ({
        original: item,
        columnProps,
    }: {
        original: TransactionModel;
        columnProps: {
            rest: {
                updateRecords: UpdateRecords;
            };
        };
    }) => <RatingDisplay item={item} updateRecords={columnProps.rest.updateRecords} />,
    accessor: 'favorite',
    //
    width: 120,
    headerStyle: {textAlign: 'center'},
    style: {textAlign: 'center'},
};

const WeightColumn = {
    Header: 'Weight (g)',
    filterable: true,
    Cell: ({original: item}: {original: TransactionModel}) => <WeightDisplay item={item} />,
    accessor: 'weight',
    //
    width: 110,
    headerStyle: {textAlign: 'center'},
    style: {textAlign: 'right'},
};

const PricePerWeightColumn = {
    Header: 'Price/g',
    sortable: true,
    Cell: ({original: item}: {original: TransactionModel}) => <PricePerGDisplay item={item} />,
    accessor: 'sum_per_weight',
    //
    width: 100,
    headerStyle: {textAlign: 'center'},
    style: {textAlign: 'right'},
};

const StockUnitsCol = {
    Header: 'Stock Units',
    sortable: true,
    accessor: 'stock_units',
    Cell: ({original: transaction}: {original: TransactionModel}) =>
        transaction.stock_units ? (
            <>
                {transaction.stock_units} @{' '}
                <NumericValue
                    value={transaction.sum / transaction.stock_units}
                    currency={transaction.money_location.currency_id}
                />
            </>
        ) : null,
    ...numericColumnStyles,
};

const StockSymbolCol = {
    Header: 'Stock Symbol',
    accessor: 'stock_id',
    Filter: StockSymbolFilter,
    filterable: true,
    Cell: ({original: item}: {original: TransactionModel}) => {
        const stocksMap = useStocksMap();

        return item.stock_id ? stocksMap.get(item.stock_id)?.symbol : null;
    },
    ...numericColumnStyles,
};
