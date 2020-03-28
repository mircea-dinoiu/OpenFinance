import MomentUtils from '@date-io/moment';
import {CustomSnackbar} from 'components/snackbars';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {setScreen, updateState} from 'state/actionCreators';
// @ts-ignore
import {MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import {MuiThemeProvider} from '@material-ui/core/styles';

import {createXHR} from 'utils/fetch';
import {routes} from 'defs/routes';

import {Login} from 'routes/Login';
import {TopBar} from 'components/TopBar';

import {getScreenQueries} from 'utils/getScreenQueries';
import EventListener from 'react-event-listener';
import {theme} from 'defs/styles';
import {hot} from 'react-hot-loader/root';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {createGlobalStyle} from 'styled-components';
import 'normalize.css';
import {useSnackbars, useUsersWithActions} from 'state/hooks';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {paths} from 'js/defs';
import {Home} from 'routes/Home';
import {TypeCategories, TypeMoneyLocations, TypeMoneyLocationTypes, TypeUsers} from './types';
import {fetchCurrencies, useCurrencies} from 'state/currencies';
import {CurrenciesDrawer} from 'components/currencies/CurrenciesDrawer';

const ResponsiveGlobalStyle = createGlobalStyle`
    html, body {
      font-size: 14px;
    }
    
    body {
        font-family: Roboto, sans-serif;
        font-weight: 300;
        background: ${theme.palette.background.default};
        -webkit-font-smoothing: antialiased;
    }

    * {
        outline: none !important;
    }
`;

const AppWrapped = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const currencies = useCurrencies();
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await createXHR<TypeUsers>({
                url: routes.user.list,
            });

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
            createXHR<TypeCategories>({url: routes.categories}),
            createXHR<TypeMoneyLocations>({url: routes.moneyLocations}),
            createXHR<TypeMoneyLocationTypes>({url: routes.moneyLocationTypes}),
        ]);

        dispatch(
            updateState({
                // @ts-ignore
                categories: categoriesResponse.data,
                // @ts-ignore
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
                    <>
                        <EventListener
                            target="window"
                            onResize={onWindowResize}
                        />
                        <TopBar
                            showCurrenciesDrawer={isCurrenciesDrawerReady()}
                            onLogout={onLogout}
                        />
                        {isCurrenciesDrawerReady() && <CurrenciesDrawer />}
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
                    </>
                </V0MuiThemeProvider>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

export const App = hot(AppWrapped);
