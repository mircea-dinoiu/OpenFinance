import 'normalize.css';
import './Responsive.css';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    updateUser,
    toggleLoading,
    setScreen,
    updateState,
} from 'common/state/actions';

import {Drawer} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import fetch from 'common/utils/fetch';
import routes from 'common/defs/routes';

import Login from './ui/Login';
import Internal from './ui/Internal';
import Currencies from './ui/Currencies';
import {BigLoader} from './ui/components/loaders';
import TopBar from 'common/components/TopBar';

import {fromJS} from 'immutable';
import getScreenQueries from 'common/utils/getScreenQueries';
import EventListener from 'react-event-listener';
import {flexColumn} from 'common/defs/styles';
import {hot} from 'react-hot-loader';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const actions = {
    updateUser,
    toggleLoading,
    setScreen,
    updateState,
};

class App extends PureComponent<{
    actions: typeof actions
}> {
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
                title: 'Financial',
                ui: <Internal/>
            });
            props.actions.toggleLoading(false);
        }
    }

    showLogin() {
        this.props.actions.updateState({
            user: null,
            ui: <Login/>,
            title: 'Please Login'
        });
        this.props.actions.toggleLoading(false);
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

    onWindowResize = () => {
        this.props.actions.setScreen(getScreenQueries());
    };

    render() {
        return (
            <MuiThemeProvider>
                <div style={{
                    paddingTop: '64px',
                    ...flexColumn,
                }}>
                    <EventListener target="window" onResize={this.onWindowResize}/>
                    <TopBar
                        showCurrenciesDrawer={this.isCurrenciesDrawerReady()}
                        onLogout={this.onLogout}
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

const AppContainer = connect(state => state, dispatch => ({
    actions: bindActionCreators(actions, dispatch)
}))(App);

export default hot(module)(AppContainer);