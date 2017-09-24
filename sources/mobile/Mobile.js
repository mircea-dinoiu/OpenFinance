import 'normalize.css';
import './Mobile.scss';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';
import {createStore, bindActionCreators} from 'redux';
import moment from 'moment';
import {reducer} from './state/reducers';
import * as actions from './state/actions';

import {AppBar, Drawer, IconButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import EuroSymbol from 'material-ui-icons/EuroSymbol';

import fetch from 'common/utils/fetch';
import routes from 'common/defs/routes';

import Login from './ui/Login';
import Logged from './ui/appBar/Logged';
import Internal from './ui/Internal';
import Currencies from './ui/Currencies';
import {BigLoader} from './ui/components/loaders';

import {fromJS} from 'immutable';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class Mobile extends PureComponent {
    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user != nextProps.user && nextProps.user != null) {
            this.loadData(nextProps);
        }
    }

    async loadData(props = this.props) {
        props.actions.toggleLoading(true);

        if (props.user == null) {
            const response = await fetch(routes.user.list);
            
            if (response.ok) {
                props.actions.updateUser(fromJS(await response.json()))
            } else {
                this.showLogin();
            }
        } else {
            const [
                currenciesResponse,
                categoriesResponse,
                mlResponse,
                mlTypesResponse
            ] = await Promise.all([
                fetch(routes.getCurrencies),
                fetch(routes.category.list),
                fetch(routes.ml.list),
                fetch(routes.mlType.list)
            ]);
            
            props.actions.updateState({
                currencies: fromJS(await currenciesResponse.json()),
                categories: fromJS(await categoriesResponse.json()),
                moneyLocations: fromJS(await mlResponse.json()),
                moneyLocationTypes: fromJS(await mlTypesResponse.json()),
                loading: false,
                title: 'Financial',
                endDate: moment().format('YYYY-MM-DD'),
                ui: <Internal/>
            });
        }
    }

    showLogin() {
        this.props.actions.updateState({
            user: null,
            ui: <Login/>,
            loading: false,
            title: 'Please Login'
        });
    }

    onLogout = async() => {
        this.props.actions.toggleLoading(true);

        const response = await fetch(routes.user.logout, {method: 'POST'});

        if (response.ok) {
            this.showLogin();
        } else {
            location.reload();
        }
    };

    isCurrenciesDrawerReady() {
        return this.props.user != null && this.props.currencies != null;
    }

    render() {
        return (
            <MuiThemeProvider>
                <div style={{
                    paddingTop: '64px',
                }}>
                    <AppBar
                        title={this.props.title}
                        showMenuIconButton={this.isCurrenciesDrawerReady()}
                        onLeftIconButtonTouchTap={() => this.props.actions.updateState({currenciesDrawerOpen: true})}
                        iconElementLeft={<IconButton><EuroSymbol/></IconButton>}
                        iconElementRight={this.props.user ? <Logged onLogout={this.onLogout}/> : null}
                        style={{
                            position: 'fixed',
                            top: 0,
                        }}
                    />
                    {this.isCurrenciesDrawerReady() && (
                        <Drawer
                            docked={false}
                            open={this.props.currenciesDrawerOpen}
                            onRequestChange={(currenciesDrawerOpen) => this.props.actions.updateState({currenciesDrawerOpen})}
                        >
                            <Currencies data={this.props.currencies}/>
                        </Drawer>
                    )}
                    {
                        this.props.loading ? (
                            <BigLoader/>
                        ) : this.props.ui
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

const MobileContainer = connect(state => state, dispatch => ({
    actions: bindActionCreators(actions, dispatch)
}))(Mobile);

const store = createStore(reducer, {
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
        <MobileContainer/>
    </Provider>,
    document.getElementById('root')
);
