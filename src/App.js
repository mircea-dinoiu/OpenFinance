// @flow weak
import {blue} from '@material-ui/core/colors';
import MomentUtils from '@date-io/moment';
import {CustomSnackbar} from 'common/components/snackbars';
import React from 'react';
import {useDispatch} from 'react-redux';
import {
    updateUser,
    setScreen,
    updateState,
    fetchCurrencies,
} from 'common/state/actionCreators';

import {Drawer, MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

import {createXHR} from 'common/utils/fetch';
import routes from 'common/defs/routes';

import Login from './mobile/ui/Login';
import Internal from './mobile/ui/Internal';
import Currencies from './mobile/ui/Currencies';
import {BigLoader} from './common/components/loaders';
import TopBar from 'common/components/TopBar';

import getScreenQueries from 'common/utils/getScreenQueries';
import EventListener from 'react-event-listener';
import {flexColumn} from 'common/defs/styles';
import {hot} from 'react-hot-loader/root';
import {Sizes} from 'common/defs';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {createGlobalStyle} from 'styled-components';
import cssNormalize from 'normalize.css';
import {
    useTitleWithSetter,
    usePageWithSetter,
    useLoadingWithSetter,
    useCurrenciesDrawerOpenWithSetter, useSnackbars, useUser, useCurrencies,
} from 'common/state/hooks';

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
`;

const App = () => {
    const dispatch = useDispatch();
    const user = useUser();
    const currencies = useCurrencies();
    const [snackbar] = useSnackbars();
    const [
        currenciesDrawerOpen,
        setCurrenciesDrawerOpen,
    ] = useCurrenciesDrawerOpenWithSetter();
    const [loading, setLoading] = useLoadingWithSetter();
    const [page, setPage] = usePageWithSetter();
    const [, setTitle] = useTitleWithSetter();

    const showLogin = () => {
        setPage(<Login />);
        setTitle('Please Login');
        dispatch(updateUser(null));
        setLoading(false);
    };

    const loadData = async () => {
        setLoading(true);

        if (user == null) {
            try {
                const response = await createXHR({url: routes.user.list});

                dispatch(updateUser(response.data));
            } catch (e) {
                showLogin();
            }
        } else {
            dispatch(fetchCurrencies());

            const [
                categoriesResponse,
                mlResponse,
                mlTypesResponse,
            ] = await Promise.all([
                createXHR({url: routes.category.list}),
                createXHR({url: routes.ml.list}),
                createXHR({url: routes.mlType.list}),
            ]);

            dispatch(
                updateState({
                    categories: categoriesResponse.data,
                    moneyLocations: mlResponse.data,
                    moneyLocationTypes: mlTypesResponse.data,
                    title: 'Financial',
                    ui: <Internal />,
                }),
            );
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadData();
    }, [user]);

    const onLogout = async () => {
        setLoading(true);

        try {
            await createXHR({url: routes.user.logout, method: 'POST'});

            showLogin();
        } catch (e) {
            location.reload();
        }
    };

    const isCurrenciesDrawerReady = () => user != null && currencies != null;

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
                        {loading ? <BigLoader /> : page}
                        <CustomSnackbar {...snackbar} open={snackbar != null} />
                    </div>
                </V0MuiThemeProvider>
            </MuiThemeProvider>
        </MuiPickersUtilsProvider>
    );
};

export default hot(App);
