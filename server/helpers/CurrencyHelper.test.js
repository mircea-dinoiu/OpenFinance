const { jsonToRates, appendRatesToCurrencies } = require('./CurrencyHelper');
const allowedISOCodes = ['USD', 'RON', 'EUR'];
const json = {
    base: 'EUR',
    rates: {
        RON: 4.6576,
        USD: 1.2320,
        GBP: 1.1379,
    }
};

describe('jsonToRates', () => {
    it('should map correct rates when default currency is RON', () => {
        expect(
            jsonToRates(json, {
                allowedISOCodes,
                defaultCurrencyISOCode: 'RON',
            }),
        ).toEqual({"EUR": 0.214, "RON": 1, "USD": 0.264});
    });

    it('should map correct rates when default currency is USD', () => {
        expect(
            jsonToRates(json, {
                allowedISOCodes,
                defaultCurrencyISOCode: 'USD',
            }),
        ).toEqual({"EUR": 0.811, "RON": 3.780, "USD": 1});
    });
});

describe('appendRatesToCurrencies', () => {
    const map = {
        '1': {
            iso_code: 'USD',
        },
        '2': {
            iso_code: 'RON',
        },
        '3': {
            iso_code: 'EUR',
        },
    };

    it('should provide correct mappings for RON', () => {
        const mutatedMap = {
            '1': { iso_code: 'USD', rates: { EUR: 0.810, RON: 3.787 } },
            '2': { iso_code: 'RON', rates: { EUR: 0.214, USD: 0.264 } },
            '3': { iso_code: 'EUR', rates: { RON: 4.672, USD: 1.233 } },
        };
        const rates = jsonToRates(json, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'RON',
        });

        appendRatesToCurrencies(map, {
            rates,
            defaultCurrencyISOCode: 'RON',
        });

        expect(map).toEqual(mutatedMap);
    });

    it('should provide correct mappings for USD', () => {
        const mutatedMap = {
            '1': { iso_code: 'USD', rates: { EUR: 0.811, RON: 3.780 } },
            '2': { iso_code: 'RON', rates: { EUR: 0.214, USD: 0.264 } },
            '3': { iso_code: 'EUR', rates: { RON: 4.660, USD: 1.233 } },
        };
        const rates = jsonToRates(json, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'USD',
        });

        appendRatesToCurrencies(map, {
            rates,
            defaultCurrencyISOCode: 'USD',
        });

        expect(map).toEqual(mutatedMap);
    });
});
