import {Api} from 'app/Api';
import {makeCrudReducer} from 'app/state/makeCrudReducer';
import {TProperty} from 'properties/defs';
import _ from 'lodash';

const {reducer: propertiesReducer, hook: useProperties} = makeCrudReducer<TProperty[]>({
    initialState: [],
    name: 'properties',
    route: Api.properties,
    parse: (properties) => _.sortBy(properties, 'name'),
});

export {propertiesReducer, useProperties};
