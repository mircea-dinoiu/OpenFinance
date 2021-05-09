import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {SelectFilterProps, SelectFilter} from 'transactions/filters/SelectFilter';
import {useInventories} from 'inventories/state';
import {EditableCell} from 'transactions/cells/EditableCell';

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
    headerStyle: style,
    style,
    width: 150,
};
