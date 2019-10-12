import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {combinedReducers} from 'state/reducers';
import App from './App';
import thunk from 'redux-thunk';
import {readState, saveState} from 'state/persistency';
import throttle from 'lodash/throttle';
import * as serviceWorker from './serviceWorker';

// @ts-ignore
const reduxExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(
    combinedReducers,
    readState(),
    /* eslint no-underscore-dangle: 0 */
    compose(
        applyMiddleware(thunk),
        reduxExtension ? reduxExtension() : (noop) => noop,
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
    // @ts-ignore
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
