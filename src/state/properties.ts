import {routes} from 'defs/routes';
import {makeCrudReducer} from 'state/utils';

export type Property = {
    id: number;
    name: string;
    cost: number;
    market_value: number;
    currency_id: number;
};

const {reducer: propertiesReducer, hook: useProperties} = makeCrudReducer<Property[]>({
    initialState: [],
    name: 'properties',
    route: routes.properties,
});

export {propertiesReducer, useProperties};
