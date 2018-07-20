import 'normalize.css';
import 'react-table/react-table.css';
import 'react-tippy/dist/tippy.css';
import './Responsive.pcss';
import 'babel-polyfill';
import { blue } from '@material-ui/core/colors';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    updateUser,
    toggleLoading,
    setScreen,
    updateState,
    fetchCurrencies,
} from 'common/state/actions';

import { Drawer, MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import fetch from 'common/utils/fetch';
import routes from 'common/defs/routes';

import Login from './ui/Login';
import Internal from './ui/Internal';
import Currencies from './ui/Currencies';
import { BigLoader } from './ui/components/loaders';
import TopBar from 'common/components/TopBar';

import { fromJS } from 'immutable';
import getScreenQueries from 'common/utils/getScreenQueries';
import EventListener from 'react-event-listener';
import { flexColumn } from 'common/defs/styles';
import { hot } from 'react-hot-loader';
import { Sizes } from 'common/defs';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const actions = {
    updateUser,
    toggleLoading,
    setScreen,
    updateState,
    fetchCurrencies,
};
const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

class Responsive extends PureComponent<{
    actions: typeof actions,
}> {
    componentDidMount() {
        this.loadData();
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.user != nextProps.user && nextProps.user != null) {
            this.loadData(nextProps);
        }
    }

    async loadData(props = this.props) {
        props.actions.toggleLoading(true);

        if (props.user == null) {
            const response = await fetch(routes.user.list);

            if (response.ok) {
                props.actions.updateUser(fromJS(await response.json()));
            } else {
                this.showLogin();
            }
        } else {
            props.actions.fetchCurrencies();

            const [
                categoriesResponse,
                mlResponse,
                mlTypesResponse,
            ] = await Promise.all([
                fetch(routes.category.list),
                fetch(routes.ml.list),
                fetch(routes.mlType.list),
            ]);

            props.actions.updateState({
                categories: fromJS(await categoriesResponse.json()),
                moneyLocations: fromJS(await mlResponse.json()),
                moneyLocationTypes: fromJS(await mlTypesResponse.json()),
                title: 'Financial',
                ui: <Internal />,
            });
            props.actions.toggleLoading(false);
        }
    }

    showLogin() {
        this.props.actions.updateState({
            ui: <Login />,
            title: 'Please Login',
        });
        this.props.actions.updateUser(null);
        this.props.actions.toggleLoading(false);
    }

    onLogout = async () => {
        this.props.actions.toggleLoading(true);

        const response = await fetch(routes.user.logout, { method: 'POST' });

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
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <MuiThemeProvider theme={theme}>
                    <V0MuiThemeProvider>
                        <div
                            style={{
                                paddingTop: Sizes.HEADER_SIZE,
                                ...flexColumn,
                            }}
                        >
                            <EventListener
                                target="window"
                                onResize={this.onWindowResize}
                            />
                            <TopBar
                                showCurrenciesDrawer={this.isCurrenciesDrawerReady()}
                                onLogout={this.onLogout}
                            />
                            {this.isCurrenciesDrawerReady() && (
                                <Drawer
                                    docked={false}
                                    open={this.props.currenciesDrawerOpen}
                                    openSecondary={true}
                                    onRequestChange={(currenciesDrawerOpen) =>
                                        this.props.actions.updateState({
                                            currenciesDrawerOpen,
                                        })
                                    }
                                >
                                    <Currencies data={this.props.currencies} />
                                </Drawer>
                            )}
                            {this.props.loading ? <BigLoader /> : this.props.ui}
                        </div>
                    </V0MuiThemeProvider>
                </MuiThemeProvider>
            </MuiPickersUtilsProvider>
        );
    }
}

const AppContainer = connect(
    (state) => state,
    (dispatch) => ({
        actions: bindActionCreators(actions, dispatch),
    }),
)(Responsive);

export default hot(module)(AppContainer);
