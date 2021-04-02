import {Api} from 'app/Api';
import {makeCrudReducer} from 'app/state/makeCrudReducer';
import {Inventory} from 'inventories/defs';
import _ from 'lodash';

const {reducer: inventoriesReducer, hook: useInventories} = makeCrudReducer<Inventory[]>({
    initialState: [],
    name: 'inventories',
    route: Api.inventories,
    parse: (inventories) => _.sortBy(inventories, 'name'),
});

export {inventoriesReducer, useInventories};
