import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import {combinedReducers} from 'state/reducers';
import {App} from './App';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';

// @ts-ignore
const reduxExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(
    combinedReducers,
    {},
    /* eslint no-underscore-dangle: 0 */
    compose(
        applyMiddleware(thunk),
        reduxExtension ? reduxExtension() : (noop: any) => noop,
    ),
);

const root = document.getElementById('root');

root &&
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        root,
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
