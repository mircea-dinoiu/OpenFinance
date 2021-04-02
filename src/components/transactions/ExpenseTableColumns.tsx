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
import * as React from 'react';
import {useStocksMap} from 'domain/stocks/state';
import {InventoryColumn} from 'components/BaseTable/columns/InventoryColumn';
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
