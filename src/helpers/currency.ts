import {CurrencyMap, Currency} from 'types';

export const findCurrencyById = (id: number, currencies: CurrencyMap): Currency => currencies[String(id)];

export const getCurrencyByISOCode = (ISOCode: string, currencies: CurrencyMap) =>
    Object.values(currencies).find((each) => each.iso_code === ISOCode);
