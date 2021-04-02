import {accountsReducer} from 'accounts/state';
import {categoriesReducer} from 'categories/state';
import {currenciesReducer} from 'currencies/state';
import {inventoriesReducer} from 'inventories/state';
import {privacyToggleReducer} from 'privacyToggle/state';
import {propertiesReducer} from 'properties/state';
import {combineReducers} from 'redux';
import {refreshWidgetsReducer} from 'refreshWidgets/state';
import {snackbarsReducer} from 'snackbars/state';
import {stocksReducer} from 'stocks/state';
import {summaryReducer} from 'summary/state';
import {userReducer} from 'users/state';

export const combinedReducers = combineReducers({
    currencies: currenciesReducer,

    refreshWidgets: refreshWidgetsReducer,
    user: userReducer,
    categories: categoriesReducer,
    stocks: stocksReducer,
    moneyLocations: accountsReducer,
    snackbars: snackbarsReducer,
    privacyToggle: privacyToggleReducer,
    summary: summaryReducer,
    inventories: inventoriesReducer,
    properties: propertiesReducer,
});
