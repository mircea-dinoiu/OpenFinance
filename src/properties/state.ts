import {Api} from 'app/Api';
import {makeCrudReducer} from 'app/state/makeCrudReducer';
import {Property} from 'properties/defs';
import _ from 'lodash';

const {reducer: propertiesReducer, hook: useProperties} = makeCrudReducer<Property[]>({
    initialState: [],
    name: 'properties',
    route: Api.properties,
    parse: (properties) => _.sortBy(properties, 'name'),
});

export {propertiesReducer, useProperties};
