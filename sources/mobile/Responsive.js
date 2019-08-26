import {blue} from '@material-ui/core/colors';
import MomentUtils from '@date-io/moment';
import {CustomSnackbar} from 'mobile/ui/components/snackbars';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    updateUser,
    toggleLoading,
    setScreen,
    updateState,
    fetchCurrencies,
} from 'common/state/actions';

import {Drawer, MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

import {createXHR} from 'common/utils/fetch';
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
import {hot} from 'react-hot-loader/root';
import {Sizes} from 'common/defs';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {createGlobalStyle} from 'styled-components';
import cssNormalize from 'normalize.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// FIXME Temporarily disabled due to incompatibility with the infrastructure
// injectTapEventPlugin();

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
    typography: {
        htmlFontSize: 16,
    },
});

const ResponsiveGlobalStyle = createGlobalStyle`
    ${cssNormalize} 
    
    html, body {
      font-size: 14px;
    }
    
    body {
        font-family: Roboto, sans-serif;
        font-weight: 300;
        background: #eeeeee;
        -webkit-font-smoothing: antialiased;
    }

    * {
        outline: none !important;
    }

    .inlineBlock {
        display: inline-block;
    }

    .uppercase {
        text-transform: uppercase;
    }

    .hPadded:not(:last-child) {
        margin-right: 10px;
    }

    .noWrap {
        white-space: nowrap;
    }

    .textRight {
        text-align: right;
    }

    .textCenter {
        text-align: center;
    }

    .fullWidth {
        width: 100%;
    }

    .bold {
        font-weight: bold;
    }

    .centerBlock {
        margin-left: auto;
        margin-right: auto;
    }

    .cursorPointer {
        cursor: pointer;
    }
`;

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
            try {
                const response = await createXHR({url: routes.user.list});

                props.actions.updateUser(fromJS(response.data));
            } catch (e) {
                this.showLogin();
            }
        } else {
            props.actions.fetchCurrencies();

            const [
                categoriesResponse,
                mlResponse,
                mlTypesResponse,
            ] = await Promise.all([
                createXHR({url: routes.category.list}),
                createXHR({url: routes.ml.list}),
                createXHR({url: routes.mlType.list}),
            ]);

            props.actions.updateState({
                categories: fromJS(categoriesResponse.data),
                moneyLocations: fromJS(mlResponse.data),
                moneyLocationTypes: fromJS(mlTypesResponse.data),
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

        try {
            await createXHR({url: routes.user.logout, method: 'POST'});

            this.showLogin();
        } catch (e) {
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
                        <ResponsiveGlobalStyle />
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
                                    <Currencies />
                                </Drawer>
                            )}
                            {this.props.loading ? <BigLoader /> : this.props.ui}
                            {this.renderSnackbar()}
                        </div>
                    </V0MuiThemeProvider>
                </MuiThemeProvider>
            </MuiPickersUtilsProvider>
        );
    }

    renderSnackbar() {
        const [snackbar] = this.props.snackbars;

        return <CustomSnackbar {...snackbar} open={snackbar != null} />;
    }
}

const AppContainer = connect(
    (state) => state,
    (dispatch) => ({
        actions: bindActionCreators(actions, dispatch),
    }),
)(Responsive);

export default hot(AppContainer);
