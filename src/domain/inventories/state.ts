import {Api} from 'defs/Api';
import {Inventory} from 'domain/inventories/defs';
import _ from 'lodash';
import {makeCrudReducer} from 'state/utils';

const {reducer: inventoriesReducer, hook: useInventories} = makeCrudReducer<Inventory[]>({
    initialState: [],
    name: 'inventories',
    route: Api.inventories,
    parse: (inventories) => _.sortBy(inventories, 'name'),
});

export {inventoriesReducer, useInventories};
