import {DescriptionDisplay} from 'transactions/cells/DescriptionDisplay';
import {PricePerGDisplay} from 'transactions/cells/PricePerGDisplay';
import {AccountColumn} from 'transactions/columns/AccountColumn';
import {AmountColumn} from 'transactions/columns/AmountColumn';
import {DateTimeColumn} from 'transactions/columns/DateTimeColumn';
import {RepeatColumn} from 'transactions/columns/RepeatColumn';
import {CategoriesFilter} from 'transactions/filters/CategoriesFilter';
import {DescriptionFilter} from 'transactions/filters/DescriptionFilter';
import {StockSymbolFilter} from 'transactions/filters/StockSymbolFilter';
import {UsersFilter} from 'transactions/filters/UsersFilter';
import {NumericValue} from 'app/formatters';
import {CategoriesDisplay} from 'transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'transactions/cells/PersonsDisplay';
import {RatingDisplay} from 'transactions/cells/RatingDisplay';
import {WeightDisplay} from 'transactions/cells/WeightDisplay';
import {TransactionModel, UpdateRecords} from 'transactions/defs';
import * as React from 'react';
import {useStocksMap} from 'stocks/state';
import {InventoryColumn} from 'transactions/columns/InventoryColumn';
import {numericColumnStyles} from 'app/styles/column';

export const makeTransactionsColumns = ({updateRecords}: {updateRecords: UpdateRecords}) => [
    QuantityCol,
    PriceCol,
    AmountColumn,
    DescriptionColumn,
    StockSymbolCol,
    DateTimeColumn,
    CategoriesColumn,
    AccountColumn,
    PersonsColumn,
    InventoryColumn,
    RepeatColumn,
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

const QuantityCol = {
    Header: 'Qty',
    sortable: true,
    filterable: true,
    accessor: 'quantity',
    width: 50,
    ...numericColumnStyles,
};

const PriceCol = {
    Header: 'Price',
    sortable: true,
    filterable: true,
    id: 'price',
    Cell: ({original: transaction}: {original: TransactionModel}) => (
        <NumericValue value={transaction.price} currency={transaction.money_location.currency_id} />
    ),
    width: 100,
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
