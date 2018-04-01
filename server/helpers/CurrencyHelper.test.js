const {xmlToRates, appendRatesToCurrencies} = require('./CurrencyHelper');

const allowedISOCodes = ['USD', 'RON', 'EUR'];
const xml = {
    "DataSet": {
        "$": {
            "xmlns": "http://www.bnr.ro/xsd",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.bnr.ro/xsd nbrfxrates.xsd"
        },
        "Header": [{
            "Publisher": ["National Bank of Romania"],
            "PublishingDate": ["2018-03-30"],
            "MessageType": ["DR"]
        }],
        "Body": [{
            "Subject": ["Reference rates"],
            "OrigCurrency": ["RON"],
            "Cube": [{
                "$": {"date": "2018-03-30"},
                "Rate": [{"_": "1.0285", "$": {"currency": "AED"}}, {
                    "_": "2.9073",
                    "$": {"currency": "AUD"}
                }, {"_": "2.3814", "$": {"currency": "BGN"}}, {"_": "1.1431", "$": {"currency": "BRL"}}, {
                    "_": "2.9349",
                    "$": {"currency": "CAD"}
                }, {"_": "3.9632", "$": {"currency": "CHF"}}, {"_": "0.6020", "$": {"currency": "CNY"}}, {
                    "_": "0.1835",
                    "$": {"currency": "CZK"}
                }, {"_": "0.6248", "$": {"currency": "DKK"}}, {"_": "0.2143", "$": {"currency": "EGP"}}, {
                    "_": "4.6576",
                    "$": {"currency": "EUR"}
                }, {"_": "5.3090", "$": {"currency": "GBP"}}, {"_": "0.6264", "$": {"currency": "HRK"}}, {
                    "_": "1.4910",
                    "$": {"currency": "HUF", "multiplier": "100"}
                }, {"_": "0.0580", "$": {"currency": "INR"}}, {
                    "_": "3.5583",
                    "$": {"currency": "JPY", "multiplier": "100"}
                }, {"_": "0.3557", "$": {"currency": "KRW", "multiplier": "100"}}, {
                    "_": "0.2295",
                    "$": {"currency": "MDL"}
                }, {"_": "0.2081", "$": {"currency": "MXN"}}, {"_": "0.4826", "$": {"currency": "NOK"}}, {
                    "_": "2.7353",
                    "$": {"currency": "NZD"}
                }, {"_": "1.1066", "$": {"currency": "PLN"}}, {"_": "0.0394", "$": {"currency": "RSD"}}, {
                    "_": "0.0658",
                    "$": {"currency": "RUB"}
                }, {"_": "0.4533", "$": {"currency": "SEK"}}, {"_": "0.1213", "$": {"currency": "THB"}}, {
                    "_": "0.9539",
                    "$": {"currency": "TRY"}
                }, {"_": "0.1436", "$": {"currency": "UAH"}}, {
                    "_": "3.7779",
                    "$": {"currency": "USD"}
                }, {"_": "160.9380", "$": {"currency": "XAU"}}, {
                    "_": "5.4941",
                    "$": {"currency": "XDR"}
                }, {"_": "0.3194", "$": {"currency": "ZAR"}}]
            }]
        }]
    }
};

describe('xmlToRates', () => {
    it('should map correct rates when default currency is RON', () => {
        expect(xmlToRates(xml, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'RON'
        })).toEqual(
            {"EUR": 0.2147, "RON": 1, "USD": 0.2646}
        );
    });

    it('should map correct rates when default currency is USD', () => {
        expect(xmlToRates(xml, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'USD'
        })).toEqual(
            {"EUR": 0.8114, "RON": 3.7792, "USD": 1}
        );
    });
});

describe('appendRatesToCurrencies', () => {
    const map = {
        '1': {
            iso_code: 'USD'
        },
        '2': {
            iso_code: 'RON',
        },
        '3': {
            iso_code: 'EUR',
        }
    };
    const mutatedMap = {
        "1": {"iso_code": "USD", "rates": {"EUR": 0.8114, "RON": 3.7792}},
        "2": {"iso_code": "RON", "rates": {"EUR": 0.2147, "USD": 0.2646}},
        "3": {"iso_code": "EUR", "rates": {"RON": 4.6576, "USD": 1.2324}}
    };

    it('should provide correct mappings for RON', () => {
        const rates = xmlToRates(xml, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'RON'
        });

        appendRatesToCurrencies(map, {
            rates,
            defaultCurrencyISOCode: 'RON',
        });

        expect(map).toEqual(mutatedMap);
    });

    it('should provide correct mappings for USD', () => {
        const rates = xmlToRates(xml, {
            allowedISOCodes,
            defaultCurrencyISOCode: 'USD'
        });

        appendRatesToCurrencies(map, {
            rates,
            defaultCurrencyISOCode: 'USD',
        });

        expect(map).toEqual(mutatedMap);
    });
});