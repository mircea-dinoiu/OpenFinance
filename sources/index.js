// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {reducer} from 'common/state/reducers';
import App from './App';
import thunk from 'redux-thunk';
import {readState, saveState} from 'common/state/persistency';
import throttle from 'lodash/throttle';
import {createLogger} from 'redux-logger';

const store = createStore(
    reducer,
    readState(),
    /* eslint no-underscore-dangle: 0 */
    compose(
        applyMiddleware(thunk, createLogger({collapsed: true})),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (noop) => noop,
    ),
);

store.subscribe(
    throttle(() => {
        saveState(store.getState());
    }, 1000),
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);
