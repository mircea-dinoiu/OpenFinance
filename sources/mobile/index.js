// @flow
import React from 'react';
import {Provider} from 'react-redux';
import getScreenQueries from 'common/utils/getScreenQueries';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {reducer} from 'common/state/reducers';
import Responsive from './Responsive';

const store = createStore(reducer, {
    screen: getScreenQueries(),
    title: 'Loading..',
    loading: true,
    ui: null,
    currenciesDrawerOpen: false,

    user: null,
    currencies: null,
    categories: null,
    moneyLocations: null,
    moneyLocationTypes: null
}, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop);

render(
    <Provider store={store}>
        <Responsive/>
    </Provider>,
    document.getElementById('root')
);
