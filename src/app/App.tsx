import MomentUtils from '@date-io/moment';
import {Box, CssBaseline} from '@material-ui/core';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {useAccountsReader} from 'accounts/state';
import {Api} from 'app/Api';

import {createXHR} from 'app/fetch';
import {FloatingSnackbar} from 'app/snackbars';
import {createTheme} from 'app/styles/createTheme';
import {TopBar} from 'app/topBar/TopBar';
import {useCategoriesReader} from 'categories/state';
import {fetchCurrencies} from 'currencies/state';
import {paths} from 'app/paths';
import 'normalize.css';
import {useSelectedProject} from 'projects/state';
import React, {Suspense, useMemo, useState} from 'react';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {generatePath, HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import {useSnackbars} from 'snackbars/state';
import {fetchStocks} from 'stocks/state';
import {TBootstrap} from 'users/defs';

import {Login} from 'users/Login';
import {useBootstrap, useUsersWithActions} from 'users/state';
import {useEndDate} from './dates/helpers';
import moment from 'moment';
import {formatYMD} from './dates/formatYMD';
import {BigLoader} from './loaders';
import {useRefreshToken} from '../refreshWidgets/state';

const Dashboard = React.lazy(() => import('dashboard'));
const Transactions = React.lazy(() => import('transactions'));

const AppWrapped = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);
    const readCategories = useCategoriesReader();
    const readAccounts = useAccountsReader();
    const selectedProject = useSelectedProject();
    const [endDate] = useEndDate();
    const date = formatYMD(moment.min(moment(), moment(endDate)).toDate());
    const refreshToken = useRefreshToken();

    const fetchUser = async () => {
        try {
            const response = await createXHR<TBootstrap>({
                url: Api.user.list,
            });

            dispatch(setUsers(response.data));
            setReady(true);
        } catch (e) {
            setReady(true);
        }
    };

    React.useEffect(() => {
        fetchUser();
    }, []);

    React.useEffect(() => {
        if (users) {
            dispatch(fetchCurrencies());
            readCategories();
            readAccounts();
        }
    }, [refreshToken, users, selectedProject?.id]);

    React.useEffect(() => {
        if (users) {
            dispatch(
                fetchStocks({
                    date,
                }),
            );
        }
    }, [refreshToken, users, date, selectedProject?.id]);

    return (
        <>
            {ready && (
                <Switch>
                    <Route exact={true} strict={false} path={paths.login} component={Login} />
                    <Route
                        exact={true}
                        strict={false}
                        path={Object.values(paths).filter((p) => p !== paths.login)}
                        component={AppLoggedIn}
                    />
                </Switch>
            )}
            <FloatingSnackbar {...snackbar} open={snackbar != null} />
        </>
    );
};

const AppInner = () => {
    const theme = useMemo(() => createTheme(), []);

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <HashRouter>
                    <AppWrapped />
                </HashRouter>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

const AppLoggedIn = () => {
    const users = useBootstrap();
    const project = useSelectedProject();

    if (users) {
        return (
            <>
                <TopBar />
                <Box
                    margin={{
                        lg: 1,
                    }}
                >
                    <Switch>
                        <Route path={paths.dashboard}>
                            {() => (
                                <Suspense fallback={<BigLoader />}>
                                    <Dashboard />
                                </Suspense>
                            )}
                        </Route>
                        <Route path={paths.transactions}>
                            {() => (
                                <Suspense fallback={<BigLoader />}>
                                    <Transactions />
                                </Suspense>
                            )}
                        </Route>
                        <Redirect
                            exact={true}
                            from={paths.home}
                            to={generatePath(paths.dashboard, {
                                id: project.id,
                            })}
                        />
                    </Switch>
                </Box>
            </>
        );
    }

    return <Redirect to={paths.login} />;
};

export const App = hot(AppInner);
