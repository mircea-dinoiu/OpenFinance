import * as React from 'react';
import {ShiftDateOptions} from 'defs';
import {RepeatOption} from 'js/defs';
import {$Keys, $Values} from 'utility-types';

export type TypeScreenQueries = {
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
};

export type TypePreferences = {
    endDate: string;
    endDateIncrement: 'd' | 'w' | '2w' | 'm';
    include:
        | 'ut'
        | 'until-yd'
        | 'until-tmrw'
        | 'until-now'
        | 'all'
        | 'ld'
        | 'ld'
        | 'lw'
        | 'lm'
        | 'ly';
    includePending: boolean;
};

export type TypeCurrency = {
    id: number;
    iso_code: string;
    currency: string;
    symbol: string;
    rates: {
        [key: string]: number;
    };
};

export type TypeCurrenciesApi = {
    default: number;
    from_cache: boolean;
    map: {
        [key: string]: TypeCurrency;
    };
};

export type TypeCurrencies = {selected: TypeCurrency} & {
    [key: number]: TypeCurrency;
};

export type TypeCurrencyIdentifier = string | number | TypeCurrency;

export type TypeCategory = {
    id: number;
    name: string;
    color: string;
    expenses: number;
};

export type TypeCategories = TypeCategory[];

export type TypeMoneyLocation = {
    currency_id: number;
    id: number;
    name: string;
    status: 'open' | 'closed' | 'locked';
    type_id: number;
};

export type TypeMoneyLocations = TypeMoneyLocation[];

export type TypeMoneyLocationType = {
    id: number;
    name: string;
};

export type TypeMoneyLocationTypes = TypeMoneyLocationType[];

export type TypeUser = {
    avatar: string;
    first_name: string;
    last_name: string;
    full_name: string;
    id: number;
    preferred_money_location_id: number;
};

export type TypeUsers = {
    current: TypeUser;
    list: TypeUser[];
};

export type TypeTransactionAttrType = 'deposit' | 'withdrawal';
export type TypeTransactionAttrStatus = 'pending' | 'finished';
export type TypeTransactionAttrRepeat = $Values<typeof RepeatOption>;

export type TypeTransactionForm = {
    id: number;
    sum: number;
    description: string;
    favorite: number;
    hidden: boolean;
    paymentMethod: number;
    weight: number;
    date: number;
    chargedPersons: {
        [key: string]: number;
    };
    repeatOccurrences: number;
    repeat: TypeTransactionAttrRepeat;
    type: TypeTransactionAttrType;
    status: TypeTransactionAttrStatus;
};

export type TypeTransactionModel = {
    id: number;
    categories: number[];
    favorite: number;
    item: string;
    sum: number;
    weight: number;
    users: {
        [key: string]: number;
    };
    repeat_occurrences: number;
    repeat: null | TypeTransactionAttrRepeat;
    persist: boolean;
    type: TypeTransactionAttrType;
    created_at: Date;
    hidden: boolean;
    status: TypeTransactionAttrStatus;
    money_location_id: number;
    money_location: {currency_id: number};
};

export type TypeShiftDateOption = $Keys<typeof ShiftDateOptions>;

export type TypeSnackbarProps = {
    message: React.ReactNode;
    bodyStyle?: {
        backgroundColor: string;
    };
};

export type TypeSnackbar = {
    id: string;
} & TypeSnackbarProps;

export type TypeGlobalState = {
    preferences: TypePreferences;
    title: string;

    currencies: TypeCurrencies;
    currenciesDrawerOpen: boolean;

    categories: TypeCategories;
    moneyLocationTypes: TypeMoneyLocationTypes;
    moneyLocations: TypeMoneyLocations;
    screen: TypeScreenQueries;
    screenSize: TypeScreenQueries;
    refreshWidgets: string;
    user: TypeUsers;
    snackbars: TypeSnackbar[];
};

export type TypeDispatch = (action: {type: string}) => void;
