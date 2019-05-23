const { jsonToRates, appendRatesToCurrencies } = require('./CurrencyHelper');
const allowedISOCodes = ['USD', 'RON', 'EUR'];
const json = {
    base: 'RON',
    rates: {
        EUR: 4.6576,
        USD: 3.7779,
        GBP: 5.3000,
    }
};

describe('jsonToRates', () => {
    it('should map correct rates when default currency is RON', () => {
        expect(
            jsonToRates(json, {
                allowedISOCodes,
                defaultCurrencyISOCode: 'RON',
            }),
        ).toEqual({ EUR: 0.2147, RON: 1, USD: 0.2646 });
    });

    it('should map correct rates when default currency is USD', () => {
        expect(
            jsonToRates(json, {
                allowedISOCodes,
                defaultCurrencyISOCode: 'USD',
            }),
        ).toEqual({ EUR: 0.8114, RON: 3.7792, USD: 1 });
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
    const mutatedMap = {
        '1': { iso_code: 'USD', rates: { EUR: 0.8114, RON: 3.7792 } },
        '2': { iso_code: 'RON', rates: { EUR: 0.2147, USD: 0.2646 } },
        '3': { iso_code: 'EUR', rates: { RON: 4.6576, USD: 1.2324 } },
    };

    it('should provide correct mappings for RON', () => {
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
