// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {reducer} from 'common/state/reducers';
import Responsive from './Responsive';
import thunk from 'redux-thunk';
import {readState, saveState} from 'common/state/persistency';
import throttle from 'lodash/throttle';
import logger from 'redux-logger';

const store = createStore(
    reducer,
    readState(),
    compose(
        applyMiddleware(thunk, logger),
        // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION__
            // eslint-disable-next-line no-underscore-dangle
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (noop) => noop
    )
);

store.subscribe(throttle(() => {
    saveState(store.getState());
}, 1000));

render(
    <Provider store={store}>
        <Responsive />
    </Provider>,
    document.getElementById('root')
);
