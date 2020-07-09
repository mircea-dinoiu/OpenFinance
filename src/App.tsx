import MomentUtils from '@date-io/moment';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {CurrenciesDrawer} from 'components/currencies/CurrenciesDrawer';
import {CustomSnackbar} from 'components/snackbars';
import {TopBar} from 'components/top-bar/TopBar';
import {routes} from 'defs/routes';
import {theme} from 'defs/styles';
import {paths} from 'js/defs';
import 'normalize.css';
import React, {useState} from 'react';
import EventListener from 'react-event-listener';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {
    BrowserRouter,
    Switch,
    Redirect,
    Route,
    RouteComponentProps,
} from 'react-router-dom';
import {AppTabs} from 'routes/AppTabs';

import {Login} from 'routes/Login';
import {setScreen, updateState} from 'state/actionCreators';
import {useCategoriesReader} from 'state/categories';
import {fetchCurrencies, useCurrencies} from 'state/currencies';
import {useSnackbars, useUsers, useUsersWithActions} from 'state/hooks';
import {createGlobalStyle} from 'styled-components';

import {createXHR} from 'utils/fetch';

import {getScreenQueries} from 'utils/getScreenQueries';
import {Accounts, AccountTypes, Categories, Users} from './types';

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
    
    .MuiSlider-valueLabel.MuiSlider-valueLabel {
        z-index: auto
    }
`;

const AppWrapped = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const currencies = useCurrencies();
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);
    const readCategories = useCategoriesReader();

    const fetchUser = async () => {
        try {
            const response = await createXHR<Users>({
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

        readCategories();

        const [mlResponse, mlTypesResponse] = await Promise.all([
            createXHR<Accounts>({url: routes.moneyLocations}),
            createXHR<AccountTypes>({url: routes.moneyLocationTypes}),
        ]);

        dispatch(
            updateState({
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
                <>
                    <ResponsiveGlobalStyle />
                    <BrowserRouter>
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
                            <Switch>
                                <Route
                                    exact={true}
                                    strict={false}
                                    path={paths.login}
                                    component={Login}
                                />
                                <Route component={AppInner} />
                            </Switch>
                        )}
                        <CustomSnackbar {...snackbar} open={snackbar != null} />
                    </BrowserRouter>
                </>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

const AppInner = ({location, match}: RouteComponentProps) => {
    const users = useUsers();

    if (users) {
        if (location.pathname === paths.home) {
            return <Redirect to={paths.transactions} />;
        }

        return <AppTabs />;
    }

    return <Redirect to={paths.login} />;
};

export const App = hot(AppWrapped);
