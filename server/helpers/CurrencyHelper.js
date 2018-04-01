const floorToDigits = (value, digits) => {
    const multiplier = 10 ** digits;

    return Math.floor(value * multiplier) / multiplier;
};

const appendRatesToCurrencies = (map, {rates, defaultCurrencyISOCode}) => {
    Object.entries(map).forEach(([id, currencyInfo]) => {
        map[id].rates = {};

        Object.entries(rates).forEach(([eachISOCode]) => {
            if (currencyInfo.iso_code === eachISOCode) {
                return;
            }

            let value;

            if (currencyInfo.iso_code === defaultCurrencyISOCode) {
                value = floorToDigits(rates[eachISOCode], 4);
            } else {
                value = floorToDigits(rates[eachISOCode] / rates[currencyInfo.iso_code], 4)
            }

            map[id].rates[eachISOCode] = value;
        });
    });
};

module.exports = {
    xmlToRates: (xml, {allowedISOCodes, defaultCurrencyISOCode}) => {
        const body = xml.DataSet.Body[0];
        const origCurrencyISOCode = String(body.OrigCurrency[0]);
        const rates = {};

        rates[origCurrencyISOCode] = 1;

        const Rate = body.Cube[0].Rate;

        Rate.forEach(({_, $}) => {
            const key = $.currency;

            if (allowedISOCodes.includes(key)) {
                rates[key] = floorToDigits(1 / Number(_), 4);
            }
        });


        if (defaultCurrencyISOCode !== origCurrencyISOCode) {
            Object.keys(rates).forEach(key => {
                if (key !== defaultCurrencyISOCode) {
                    rates[key] = floorToDigits(1 / rates[defaultCurrencyISOCode] * rates[key], 4);
                }
            });

            rates[origCurrencyISOCode] = floorToDigits(1 / rates[defaultCurrencyISOCode], 4);
            rates[defaultCurrencyISOCode] = 1;
        }


        return rates;
    },
    appendRatesToCurrencies,
};