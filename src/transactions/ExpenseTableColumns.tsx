import {DescriptionDisplay} from 'transactions/cells/DescriptionDisplay';
import {PricePerGDisplay} from 'transactions/cells/PricePerGDisplay';
import {CategoriesFilter} from 'transactions/filters/CategoriesFilter';
import {DescriptionFilter} from 'transactions/filters/DescriptionFilter';
import {StockSymbolFilter} from 'transactions/filters/StockSymbolFilter';
import {UsersFilter} from 'transactions/filters/UsersFilter';
import {NumericValue} from 'app/formatters';
import {CategoriesDisplay} from 'transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'transactions/cells/PersonsDisplay';
import {RatingDisplay} from 'transactions/cells/RatingDisplay';
import {WeightDisplay} from 'transactions/cells/WeightDisplay';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {useStocksMap} from 'stocks/state';
import {numericColumnStyles} from 'app/styles/column';
import {EditableCell} from 'transactions/cells/EditableCell';
import {AmountDisplay} from 'transactions/cells/AmountDisplay';
import {AccountFilter} from 'transactions/filters/AccountFilter';
import {AccountDisplayById} from 'transactions/cells/AccountDisplayById';
import {DateDisplay} from 'transactions/cells/DateDisplay';
import {SelectFilterProps, SelectFilter} from 'transactions/filters/SelectFilter';
import {useInventories} from 'inventories/state';
import {RepeatsDisplay} from 'transactions/cells/RepeatsDisplay';
import {Column} from 'react-table-6';

export const TransactionsColumns: Column[] = [
    {
        Header: 'Qty',
        sortable: true,
        filterable: true,
        accessor: 'quantity',
        width: 100,
        ...numericColumnStyles,
    },
    {
        Header: 'Price',
        sortable: true,
        filterable: true,
        id: 'price',
        Cell: ({original: t}: {original: TransactionModel}) => (
            <EditableCell id={t.id} field={'price'}>
                <NumericValue value={t.price} currency={t.money_location.currency_id} />
            </EditableCell>
        ),
        width: 100,
        ...numericColumnStyles,
    },
    {
        Header: 'Amount',
        Cell: ({original: item}: {original: TransactionModel}) => <AmountDisplay item={item} isExpanded={true} />,
        accessor: 'sum',
        //
        width: 100,
        ...numericColumnStyles,
    },
    {
        Header: 'Description',
        filterable: true,
        Filter: DescriptionFilter,
        Cell: ({original: item}: {original: TransactionModel}) => (
            <EditableCell field="description" id={item.id}>
                <DescriptionDisplay entity="transaction" item={item} accessor="item" />
            </EditableCell>
        ),
        accessor: 'item',
        minWidth: 300,
    },
    {
        Header: 'Stock Symbol',
        accessor: 'stock_id',
        Filter: StockSymbolFilter,
        filterable: true,
        Cell: ({original: item}: {original: TransactionModel}) => {
            const stocksMap = useStocksMap();

            return item.stock_id ? stocksMap.get(item.stock_id)?.symbol : null;
        },
        width: 110,
        ...numericColumnStyles,
    },
    {
        Header: 'Date & Time',
        Cell: ({original: item}: {original: TransactionModel}) => <DateDisplay item={item} />,
        accessor: 'created_at',
        defaultSortDesc: true,
        //
        width: 200,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
    },
    {
        Header: 'Categories',
        filterable: true,
        Filter: CategoriesFilter,
        Cell: ({original: t}: {original: TransactionModel}) => (
            <EditableCell id={t.id} field={'categories'}>
                <CategoriesDisplay item={t} />
            </EditableCell>
        ),
        accessor: 'categories',
        sortable: false,
        minWidth: 300,
    },
    {
        Header: 'Account',
        filterable: true,
        Filter: AccountFilter,
        Cell: ({original: item}: {original: TransactionModel}) => (
            <EditableCell id={item.id} field="paymentMethod">
                <AccountDisplayById id={item.money_location_id} />
            </EditableCell>
        ),
        accessor: 'money_location_id',
        sortable: true,
        //
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
        width: 150,
    },
    {
        Header: 'Person(s)',
        Cell: ({original: t}: {original: TransactionModel}) => (
            <EditableCell id={t.id} field={'chargedPersons'}>
                <PersonsDisplay item={t} />
            </EditableCell>
        ),
        Filter: UsersFilter,
        filterable: true,
        accessor: 'users',
        //
        width: 100,
        style: {textAlign: 'center'},
        headerStyle: {textAlign: 'center'},
        sortable: false,
    },
    {
        Header: 'Inventory',
        filterable: true,
        Filter: ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => {
            const items = useInventories().data;

            return <SelectFilter onChange={onChange} filter={filter} allowNone={true} items={items} />;
        },
        Cell: ({original: item}: {original: TransactionModel}) => {
            if (!item.inventory_id) {
                return (
                    <EditableCell field="inventoryId" id={item.id}>
                        {null}
                    </EditableCell>
                );
            }

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const inventories = useInventories().data;
            const inventory = inventories.find((each) => each.id === Number(item.inventory_id));

            return (
                <EditableCell field="inventoryId" id={item.id}>
                    {!inventory ? null : inventory.name}
                </EditableCell>
            );
        },
        accessor: 'inventory_id',
        sortable: true,
        //
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
        width: 150,
    },
    {
        Header: 'Repeat',
        Cell: ({original: item}: {original: TransactionModel}) => <RepeatsDisplay item={item} />,
        accessor: 'repeat',
        sortable: false,
        //
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
        width: 300,
    },
    {
        Header: 'Rating',
        filterable: true,
        sortable: true,
        Cell: ({original: t}: {original: TransactionModel}) => <RatingDisplay item={t} />,
        accessor: 'favorite',
        //
        width: 120,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'center'},
    },
    {
        Header: 'Weight (g)',
        filterable: true,
        Cell: ({original: item}: {original: TransactionModel}) => <WeightDisplay item={item} />,
        accessor: 'weight',
        //
        width: 110,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'right'},
    },
    {
        Header: 'Price/g',
        sortable: true,
        Cell: ({original: item}: {original: TransactionModel}) => <PricePerGDisplay item={item} />,
        accessor: 'sum_per_weight',
        //
        width: 100,
        headerStyle: {textAlign: 'center'},
        style: {textAlign: 'right'},
    },
];
