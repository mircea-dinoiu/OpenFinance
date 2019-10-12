import {blue} from '@material-ui/core/colors';
import MomentUtils from '@date-io/moment';
import {CustomSnackbar} from 'components/snackbars';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {fetchCurrencies, setScreen, updateState} from 'state/actionCreators';
// @ts-ignore
import {Drawer, MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {createXHR} from 'utils/fetch';
import routes from 'defs/routes';

import Login from './components/Login';
import Currencies from './components/Currencies';
import TopBar from 'components/TopBar';

import getScreenQueries from 'utils/getScreenQueries';
import EventListener from 'react-event-listener';
import {flexColumn} from 'defs/styles';
import {hot} from 'react-hot-loader/root';
import {Sizes} from 'defs';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {createGlobalStyle} from 'styled-components';
import 'normalize.css';
import {useCurrencies, useCurrenciesDrawerOpenWithSetter, useSnackbars, useUsersWithActions} from 'state/hooks';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {paths} from 'js/defs';
import {Home} from './components/Home';
import {TypeCategories, TypeMoneyLocations, TypeMoneyLocationTypes} from './types';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    typography: {
        htmlFontSize: 16,
    },
});

const ResponsiveGlobalStyle = createGlobalStyle`
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
`;

const App = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const currencies = useCurrencies();
    const [snackbar] = useSnackbars();
    const [
        currenciesDrawerOpen,
        setCurrenciesDrawerOpen,
    ] = useCurrenciesDrawerOpenWithSetter();
    const [ready, setReady] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await createXHR({url: routes.user.list});

            // @ts-ignore
            dispatch(setUsers(response.data));
            setReady(true);
        } catch (e) {
            setReady(true);
        }
    };

    const fetchRequirements = async () => {
        dispatch(fetchCurrencies());

        const [
            categoriesResponse,
            mlResponse,
            mlTypesResponse,
        ] = await Promise.all([
            createXHR<TypeCategories>({url: routes.category.list}),
            createXHR<TypeMoneyLocations>({url: routes.ml.list}),
            createXHR<TypeMoneyLocationTypes>({url: routes.mlType.list}),
        ]);

        dispatch(
            updateState({
                categories: categoriesResponse.data,
                moneyLocations: mlResponse.data,
                moneyLocationTypes: mlTypesResponse.data,
            }),
        );
    };

    React.useEffect(() => {
        fetchUser();
    }, []);

    React.useEffect(() => {
        if (users) {
            fetchRequirements();
        }
    }, [users]);

    const onLogout = async () => {
        try {
            await createXHR({url: routes.user.logout, method: 'POST'});

            setUsers(null);
        } catch (e) {
            window.location.reload();
        }
    };

    const isCurrenciesDrawerReady = () => users != null && currencies != null;

    const onWindowResize = () => {
        dispatch(setScreen(getScreenQueries()));
    };

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
                            onResize={onWindowResize}
                        />
                        <TopBar
                            showCurrenciesDrawer={isCurrenciesDrawerReady()}
                            onLogout={onLogout}
                        />
                        {isCurrenciesDrawerReady() && (
                            <Drawer
                                docked={false}
                                open={currenciesDrawerOpen}
                                openSecondary={true}
                                onRequestChange={(value) =>
                                    setCurrenciesDrawerOpen(value)
                                }
                            >
                                <Currencies />
                            </Drawer>
                        )}
                        {ready && (
                            <BrowserRouter>
                                <Switch>
                                    <Route
                                        path={paths.home}
                                        exact={true}
                                        component={Home}
                                    />
                                    <Route
                                        path={paths.login}
                                        exact={true}
                                        component={Login}
                                    />
                                </Switch>
                            </BrowserRouter>
                        )}
                        <CustomSnackbar {...snackbar} open={snackbar != null} />
                    </div>
                </V0MuiThemeProvider>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

export default hot(App);
