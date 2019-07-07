// @flow
import {ShiftDateOptions} from 'common/defs';
import type {Map} from 'immutable';
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

export type TypeUser = {
    avatar: string,
    first_name: string,
    last_name: string,
    full_name: string,
    id: number,
};

export type TypeUsers = Map<{
    currency: TypeUser,
    list: TypeUser[],
}>;

export type TypeMainScreenFeatures = {
    repeat?: boolean,
    status?: boolean,
    duplicate?: boolean,
};

export type TypeTransactionForm = {||};

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
|};

export type TypeShiftDateOption = $Keys<typeof ShiftDateOptions>;
