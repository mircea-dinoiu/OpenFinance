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
import {Dashboard} from 'dashboard/Dashboard';
import {paths} from 'app/paths';
import 'normalize.css';
import {useSelectedProject} from 'projects/state';
import React, {ReactNode, useMemo, useState} from 'react';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {generatePath, HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import {useSnackbars} from 'snackbars/state';
import {fetchStocks} from 'stocks/state';
import {Transactions} from 'transactions/Transactions';
import {Bootstrap} from 'users/defs';

import {Login} from 'users/Login';
import {useBootstrap, useUsersWithActions} from 'users/state';

const AppWrapped = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);
    const readCategories = useCategoriesReader();
    const readAccounts = useAccountsReader();
    const selectedProject = useSelectedProject();

    const fetchUser = async () => {
        try {
            const response = await createXHR<Bootstrap>({
                url: Api.user.list,
            });

            dispatch(setUsers(response.data));
            setReady(true);
        } catch (e) {
            setReady(true);
        }
    };

    const fetchRequirements = async () => {
        dispatch(fetchCurrencies());
        dispatch(fetchStocks());

        readCategories();
        readAccounts();
    };

    React.useEffect(() => {
        fetchUser();
    }, []);

    React.useEffect(() => {
        if (users) {
            fetchRequirements();
        }
    }, [users, selectedProject?.id]);

    return (
        <>
            {ready && (
                <Switch>
                    <Route exact={true} strict={false} path={paths.login} component={Login} />
                    <Route
                        exact={true}
                        strict={false}
                        path={[paths.home, paths.dashboard, paths.transactions]}
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
                        <Route path={paths.dashboard} component={Dashboard} />
                        <Route path={paths.transactions} component={Transactions} />
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
