import MomentUtils from '@date-io/moment';
import {Box} from '@material-ui/core';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Dashboard} from 'components/dashboard/Dashboard';
import {FloatingSnackbar} from 'components/snackbars';
import {TopBar} from 'components/top-bar/TopBar';
import {Transactions} from 'components/transactions/Transactions';
import {Api} from 'defs/Api';
import {theme} from 'defs/styles';
import {paths} from 'js/defs';
import 'normalize.css';
import React, {useState} from 'react';
import EventListener from 'react-event-listener';
import {hot} from 'react-hot-loader/root';
import {useDispatch} from 'react-redux';
import {BrowserRouter, generatePath, Redirect, Route, Switch} from 'react-router-dom';

import {Login} from 'routes/Login';
import {useAccountsReader} from 'state/accounts';
import {setScreen} from 'state/actionCreators';
import {useCategoriesReader} from 'state/categories';
import {fetchCurrencies} from 'state/currencies';
import {useBootstrap, useSnackbars, useUsersWithActions} from 'state/hooks';
import {useSelectedProject} from 'state/projects';
import {fetchStocks} from 'state/stocks';
import {createGlobalStyle} from 'styled-components';

import {createXHR} from 'utils/fetch';

import {getScreenQueries} from 'utils/getScreenQueries';
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
        overflow-y: scroll;
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

    const onWindowResize = () => {
        dispatch(setScreen(getScreenQueries()));
    };

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <MuiThemeProvider theme={theme}>
                <>
                    <ResponsiveGlobalStyle />
                    <BrowserRouter>
                        <EventListener target="window" onResize={onWindowResize} />
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
                </>
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
                    <Redirect
                        from={paths.home}
                        to={generatePath(paths.dashboard, {
                            id: project.id,
                        })}
                    />
                    <Route path={paths.dashboard} component={Dashboard} />
                    <Route path={paths.transactions} component={Transactions} />
                </Box>
            </>
        );
    }

    return <Redirect to={paths.login} />;
};

export const App = hot(AppWrapped);
