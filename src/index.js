// @ flow
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {combinedReducers} from 'common/state/reducers';
import App from './App';
import thunk from 'redux-thunk';
import {readState, saveState} from 'common/state/persistency';
import throttle from 'lodash/throttle';
import * as serviceWorker from './serviceWorker';

const store = createStore(
    combinedReducers,
    readState(),
    /* eslint no-underscore-dangle: 0 */
    compose(
        applyMiddleware(thunk),
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
    // $FlowFixMe
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
