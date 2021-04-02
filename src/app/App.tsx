import MomentUtils from '@date-io/moment';
import {Box, CssBaseline} from '@material-ui/core';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Dashboard} from 'dashboard/Dashboard';
import {FloatingSnackbar} from 'components/snackbars';
import {TopBar} from 'components/top-bar/TopBar';
import {Transactions} from 'transactions/Transactions';
import {Api} from 'app/Api';
import {useSnackbars} from 'snackbars/state';
import {Bootstrap} from 'users/defs';
import {useBootstrap, useUsersWithActions} from 'users/state';
import {paths} from 'js/defs';
import 'normalize.css';
import React, {useMemo, useState} from 'react';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {BrowserRouter, generatePath, Redirect, Route, Switch} from 'react-router-dom';

import {Login} from 'users/Login';
import {useAccountsReader} from 'accounts/state';
import {useCategoriesReader} from 'categories/state';
import {fetchCurrencies} from 'currencies/state';
import {useSelectedProject} from 'app/state/projects';
import {fetchStocks} from 'stocks/state';
import {createTheme} from 'app/styles/createTheme';

import {createXHR} from 'app/utils/fetch';

const AppWrapped = () => {
    const dispatch = useDispatch();
    const [users, {setUsers}] = useUsersWithActions();
    const [snackbar] = useSnackbars();
    const [ready, setReady] = useState(false);
    const readCategories = useCategoriesReader();
    const readAccounts = useAccountsReader();
    const theme = useMemo(() => createTheme(), []);

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
    }, [users]);

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    {ready && (
                        <Switch>
                            <Route exact={true} strict={false} path={paths.login} component={Login} />
                            <Route
                                exact={true}
                                strict={false}
                                path={[paths.home, paths.dashboard, paths.transactions]}
                                component={AppInner}
                            />
                        </Switch>
                    )}
                    <FloatingSnackbar {...snackbar} open={snackbar != null} />
                </BrowserRouter>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

const AppInner = () => {
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

export const App = hot(AppWrapped);
