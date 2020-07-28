import MomentUtils from '@date-io/moment';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {FloatingSnackbar} from 'components/snackbars';
import {TopBar} from 'components/top-bar/TopBar';
import {routes} from 'defs/routes';
import {theme} from 'defs/styles';
import {paths} from 'js/defs';
import 'normalize.css';
import React, {useState} from 'react';
import EventListener from 'react-event-listener';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {BrowserRouter, Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import {AppTabs} from 'routes/AppTabs';

import {Login} from 'routes/Login';
import {useAccountsReader} from 'state/accounts';
import {useAccountTypesReader} from 'state/accountTypes';
import {setScreen} from 'state/actionCreators';
import {useCategoriesReader} from 'state/categories';
import {fetchCurrencies} from 'state/currencies';
import {useBootstrap, useSnackbars, useUsersWithActions} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {createGlobalStyle} from 'styled-components';

import {createXHR} from 'utils/fetch';

import {getScreenQueries} from 'utils/getScreenQueries';
import {makeUrl} from 'utils/url';
import {Bootstrap} from './types';

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
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);
    const readCategories = useCategoriesReader();
    const readAccounts = useAccountsReader();
    const readAccountTypes = useAccountTypesReader();

    const fetchUser = async () => {
        try {
            const response = await createXHR<Bootstrap>({
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
        readAccounts();
        readAccountTypes();
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
                            onLogout={onLogout}
                        />
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
                        <FloatingSnackbar
                            {...snackbar}
                            open={snackbar != null}
                        />
                    </BrowserRouter>
                </>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

const AppInner = ({location, match}: RouteComponentProps) => {
    const users = useBootstrap();
    const project = useSelectedProject();

    if (users) {
        if (location.pathname === paths.home) {
            return (
                <Redirect
                    to={makeUrl(paths.transactions, {
                        projectId: project.id,
                    })}
                />
            );
        }

        return <AppTabs />;
    }

    return <Redirect to={paths.login} />;
};

export const App = hot(AppWrapped);
