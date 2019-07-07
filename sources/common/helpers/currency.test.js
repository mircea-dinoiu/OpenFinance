import {
    findCurrencyById,
    getBaseCurrency,
    getCurrencyByISOCode,
    convertCurrency,
    convertCurrencyToDefault,
} from './currency';

const RON = {
    id: 2,
    iso_code: 'RON',
    currency: 'Romanian leu',
    symbol: 'lei',
    rates: {EUR: 0.2144, GBP: 0.1897, USD: 0.2511},
};
const USD = {
    id: 1,
    iso_code: 'USD',
    currency: 'United States dollar',
    symbol: '$',
    rates: {RON: 3.9824, EUR: 0.8542, GBP: 0.7558},
};
const currencies = {
    map: {
        '1': USD,
        '2': RON,
        '3': {
            id: 3,
            iso_code: 'EUR',
            currency: 'Euro',
            symbol: '€',
            rates: {RON: 4.6621, GBP: 0.8848, USD: 1.1706},
        },
        '4': {
            id: 4,
            iso_code: 'GBP',
            currency: 'Pound sterling',
            symbol: '£',
            rates: {RON: 5.2691, EUR: 1.1301, USD: 1.3231},
        },
    },
    default: 1,
    from_cache: false,
};

describe('#findCurrencyById()', () => {
    it('should return the matching currency', () => {
        expect(findCurrencyById('2', currencies)).toEqual(RON);
    });

    it('should work with numbers', () => {
        expect(findCurrencyById('2', currencies)).toEqual(
            findCurrencyById(2, currencies),
        );
    });
});

describe('#getBaseCurrency()', () => {
    it('should return the default currency', () => {
        expect(getBaseCurrency(currencies)).toEqual(USD);
    });
});

describe('#getCurrencyByISOCode()', () => {
    it('should return the matching currency for iso code', () => {
        expect(getCurrencyByISOCode('USD', currencies)).toEqual(USD);
        expect(getCurrencyByISOCode('RON', currencies)).toEqual(RON);
    });
});

describe('#convertCurrency()', () => {
    describe('When from/to are strings, but not numeric', () => {
        it('should treat them as iso codes', () => {
            expect(
                convertCurrency({
                    value: 34,
                    from: 'USD',
                    to: 'RON',
                    currencies,
                }),
            ).toEqual(135.4016);
        });
    });

    describe('When from/to are numeric', () => {
        it('should treat them as IDs', () => {
            expect(
                convertCurrency({
                    value: 34,
                    from: '1',
                    to: '2',
                    currencies,
                }),
            ).toEqual(135.4016);
            expect(
                convertCurrency({
                    value: 34,
                    from: 1,
                    to: 2,
                    currencies,
                }),
            ).toEqual(135.4016);
        });
    });

    describe('When from/to are currency entities', () => {
        it('should treat them as entities', () => {
            expect(
                convertCurrency({
                    value: 34,
                    from: USD,
                    to: RON,
                    currencies,
                }),
            ).toEqual(135.4016);
        });
    });

    describe('When from=to', () => {
        it('should return the same value', () => {
            expect(
                convertCurrency({
                    value: 34,
                    from: USD,
                    to: USD,
                    currencies,
                }),
            ).toEqual(34);
        });
    });
});

describe('#convertCurrencyToDefault()', () => {
    it('should convert to default', () => {
        expect(convertCurrencyToDefault(135.4016, RON, currencies)).toEqual(
            33.99934176,
        );
    });
});
