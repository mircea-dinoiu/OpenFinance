// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {reducer} from 'common/state/reducers';
import Responsive from './Responsive';
import {uniqueId} from 'lodash';

const store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop);

render(
    <Provider store={store}>
        <Responsive/>
    </Provider>,
    document.getElementById('root')
);
