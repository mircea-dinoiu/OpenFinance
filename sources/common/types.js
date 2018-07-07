// @flow
/* eslint no-unused-vars: 0 */
import type { Map } from 'immutable';

type TypeScreenQueries = {
    isSmall: boolean,
    isMedium: boolean,
    isLarge: boolean,
};

type TypePreferences = {
    endDate: string,
    endDateIncrement: 'd' | 'w' | '2w' | 'm',
    include: 'ut' | 'all' | 'ld' | 'ld' | 'lw' | 'lm' | 'ly',
};

type TypeCurrency = Map<{
    id: number,
    iso_code: string,
    currency: string,
    symbol: string,
    rates: {
        [key: string]: number,
    },
}>;

type TypeCurrencies = Map<{
    default: number,
    from_cache: boolean,
    map: {
        [key: string]: TypeCurrencyMap,
    },
}>;

type TypeCurrencyIdentifier = string | number | TypeCurrencyMap;

type TypeUser = {
    avatar: string,
    first_name: string,
    last_name: string,
    full_name: string,
    id: number,
};

type TypeUsers = Map<{
    currenc: TypeUser,
    list: TypeUser[],
}>;
