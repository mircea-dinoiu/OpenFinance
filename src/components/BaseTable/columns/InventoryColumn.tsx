import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {SelectFilterProps, SelectFilter} from 'components/BaseTable/filters/SelectFilter';
import {useInventories} from 'domain/inventories/state';

const style = {textAlign: 'center'};

export const InventoryColumn = {
    Header: 'Inventory',
    filterable: true,
    Filter: ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => {
        const items = useInventories().data;

        return <SelectFilter onChange={onChange} filter={filter} allowNone={true} items={items} />;
    },
    Cell: ({original: item}: {original: TransactionModel}) => {
        if (!item.inventory_id) {
            return null;
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const inventories = useInventories().data;
        const inventory = inventories.find((each) => each.id === Number(item.inventory_id));

        return !inventory ? null : inventory.name;
    },
    accessor: 'inventory_id',
    sortable: true,
    //
    headerStyle: style,
    style,
    width: 150,
};
