import {Api} from 'app/Api';
import {Inventory} from 'inventories/defs';
import _ from 'lodash';
import {makeCrudReducer} from 'app/state/utils';

const {reducer: inventoriesReducer, hook: useInventories} = makeCrudReducer<Inventory[]>({
    initialState: [],
    name: 'inventories',
    route: Api.inventories,
    parse: (inventories) => _.sortBy(inventories, 'name'),
});

export {inventoriesReducer, useInventories};
