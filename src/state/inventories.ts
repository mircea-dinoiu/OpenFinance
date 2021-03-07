import {routes} from 'defs/routes';
import _ from 'lodash';
import {makeCrudReducer} from 'state/utils';

export type Inventory = {id: number; name: string; project_id: number};

const {reducer: inventoriesReducer, hook: useInventories} = makeCrudReducer<Inventory[]>({
    initialState: [],
    name: 'inventories',
    route: routes.inventories,
    parse: (inventories) => _.sortBy(inventories, 'name'),
});

export {inventoriesReducer, useInventories};
