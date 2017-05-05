import 'normalize.css';
import './Mobile.scss';
import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import React, {PureComponent} from 'react';
import {render} from 'react-dom';

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

class Mobile extends PureComponent {
    state = {
        title: 'Loading..',
        loading: true,
        ui: null,
        currenciesDrawerOpen: false,

        user: null,
        currencies: null,
        categories: null,
        moneyLocations: null,
        moneyLocationTypes: null
    };

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        this.setState({
            loading: true
        });

        if (this.state.user == null) {
            const response = await fetch(routes.user.list);
            
            if (response.ok) {
                this.setState({
                    user: fromJS(await response.json())
                }, this.loadData)
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
            
            this.setState({
                currencies: fromJS(await currenciesResponse.json()),
                categories: fromJS(await categoriesResponse.json()),
                moneyLocations: fromJS(await mlResponse.json()),
                moneyLocationTypes: fromJS(await mlTypesResponse.json())
            }, () => {
                this.setState({
                    ui: <Internal currencies={this.state.currencies}
                                  categories={this.state.categories}
                                  moneyLocations={this.state.moneyLocations}
                                  moneyLocationTypes={this.state.moneyLocationTypes}
                                  user={this.state.user}
                        />,
                    loading: false,
                    title: 'Financial'
                })
            });
        }
    }

    showLogin() {
        this.setState({
            user: null,
            ui: <Login onReceiveUser={user => this.setState({user: fromJS(user)}, this.loadData)}/>,
            loading: false,
            title: 'Please Login'
        });
    }

    onLogout = async() => {
        this.setState({
            loading: true
        });

        const response = await fetch(routes.user.logout, {method: 'POST'});

        if (response.ok) {
            this.showLogin();
        } else {
            location.reload();
        }
    };

    isCurrenciesDrawerReady() {
        return this.state.user != null && this.state.currencies != null;
    }

    render() {
        return (
            <MuiThemeProvider>
                <div style={{
                    paddingTop: '64px',
                }}>
                    <AppBar
                        title={this.state.title}
                        showMenuIconButton={this.isCurrenciesDrawerReady()}
                        onLeftIconButtonTouchTap={() => this.setState({currenciesDrawerOpen: true})}
                        iconElementLeft={<IconButton><EuroSymbol/></IconButton>}
                        iconElementRight={this.state.user ? <Logged onLogout={this.onLogout}/> : null}
                        style={{
                            position: 'fixed',
                            top: 0,
                        }}
                    />
                    {this.isCurrenciesDrawerReady() && (
                        <Drawer
                            docked={false}
                            open={this.state.currenciesDrawerOpen}
                            onRequestChange={(currenciesDrawerOpen) => this.setState({currenciesDrawerOpen})}
                        >
                            <Currencies data={this.state.currencies}/>
                        </Drawer>
                    )}
                    {
                        this.state.loading ? (
                            <BigLoader/>
                        ) : this.state.ui
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

render(
    <Mobile/>,
    document.getElementById('root')
);
