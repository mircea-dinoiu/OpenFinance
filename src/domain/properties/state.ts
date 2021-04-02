import {Api} from 'defs/Api';
import {Property} from 'domain/properties/defs';
import _ from 'lodash';
import {makeCrudReducer} from 'state/utils';

const {reducer: propertiesReducer, hook: useProperties} = makeCrudReducer<Property[]>({
    initialState: [],
    name: 'properties',
    route: Api.properties,
    parse: (properties) => _.sortBy(properties, 'name'),
});

export {propertiesReducer, useProperties};
