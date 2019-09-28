// @flow
import {useSelector} from 'react-redux';
import type {TypeScreenQueries, TypeCurrencies, TypeUsers} from 'common/types';

export const Actions = {
    UPDATE_STATE: 'UPDATE_STATE',
    LOADING_ENABLE: 'LOADING_ENABLE',
    LOADING_DISABLE: 'LOADING_DISABLE',
    UPDATE_USER: 'UPDATE_USER',
    SET_SCREEN: 'SET_SCREEN',
    UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
    REFRESH_WIDGETS: 'REFRESH_WIDGETS',
    SET_BASE_CURRENCY_ID: 'SET_BASE_CURRENCY_ID',
    UPDATE_CURRENCIES: 'UPDATE_CURRENCIES',
    SHOW_SNACKBAR: 'SHOW_SNACKBAR',
    HIDE_SNACKBAR: 'HIDE_SNACKBAR',
};

export const useScreenSize = (): TypeScreenQueries =>
    useSelector((s) => s.screenSize);
export const useCurrencies = (): TypeCurrencies =>
    useSelector((s) => s.currencies);
export const useUser = (): TypeUsers => useSelector((s) => s.user.toJS());
export const useMoneyLocations = () =>
    useSelector((s) => s.moneyLocations.toJS());
export const usePreferences = () => useSelector((s) => s.preferences);
export const useCategories = () => useSelector((s) => s.categories.toJS());
