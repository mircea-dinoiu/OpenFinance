import {Api} from 'app/Api';
import {makeCrudReducer} from 'app/state/makeCrudReducer';
import {TInventory} from 'inventories/defs';
import _ from 'lodash';

const {reducer: inventoriesReducer, hook: useInventories} = makeCrudReducer<TInventory[]>({
    initialState: [],
    name: 'inventories',
    route: Api.inventories,
    parse: (inventories) => _.sortBy(inventories, 'name'),
});

export {inventoriesReducer, useInventories};
