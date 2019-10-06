// @flow weak
import * as React from 'react';
import {ShiftDateOptions} from 'common/defs';
import {RepeatOption} from 'shared/defs';

export type TypeScreenQueries = {
    isSmall: boolean,
    isMedium: boolean,
    isLarge: boolean,
};

export type TypePreferences = {
    endDate: string,
    endDateIncrement: 'd' | 'w' | '2w' | 'm',
    include: | 'ut'
        | 'until-yd'
        | 'until-tmrw'
        | 'until-now'
        | 'all'
        | 'ld'
        | 'ld'
        | 'lw'
        | 'lm'
        | 'ly',
    includePending: boolean,
};

export type TypeCurrency = {
    id: number,
    iso_code: string,
    currency: string,
    symbol: string,
    rates: {
        [key: string]: number,
    },
};

export type TypeCurrencies = {
    default: number,
    from_cache: boolean,
    map: {
        [key: string]: TypeCurrency,
    },
};

export type TypeCurrencyIdentifier = string | number | TypeCurrency;

export type TypeCategory = {|
    id: number,
    name: string,
|};

export type TypeCategories = TypeCategory[];

export type TypeMoneyLocation = {|
    currency_id: number,
    id: number,
    name: string,
    status: 'open' | 'closed' | 'locked',
    type_id: number,
|};

export type TypeMoneyLocations = TypeMoneyLocation[];

export type TypeMoneyLocationType = {|
    id: number,
    name: string,
|};

export type TypeMoneyLocationTypes = TypeMoneyLocationType[];

export type TypeUser = {
    avatar: string,
    first_name: string,
    last_name: string,
    full_name: string,
    id: number,
};

export type TypeUsers = {|
    currency: TypeUser,
    list: TypeUser[],
|};

export type TypeTransactionForm = {|
    id: number,
    sum: number,
    description: string,
    notes: string,
    favorite: number,
    hidden: boolean,
|};

export type TypeTransactionModel = {|
    id: number,
    categories: number[],
    favorite: number,
    item: string,
    notes: string,
    sum: number,
    weight: number,
    users: {
        [key: string]: number,
    },
    repeat_occurrences: number,
    repeat: null | $Values<typeof RepeatOption>,
    persist: boolean,
    type: 'deposit' | 'withdrawal',
    created_at: Date,
    hidden: boolean,
    status: 'pending' | 'finished',
    money_location_id: number,
|};

export type TypeShiftDateOption = $Keys<typeof ShiftDateOptions>;

export type TypeSnackbarProps = {|
    message: React.Node,
    bodyStyle?: {
        backgroundColor: string,
    },
|};

export type TypeSnackbar = {|
    id: string,
    ...TypeSnackbarProps,
|};

export type TypeDispatch = ({type: string}) => void;

export type TypeCss = string[];
