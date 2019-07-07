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
                value = floorToDigits(rates[eachISOCode], 3);
            } else {
                value = floorToDigits(
                    rates[eachISOCode] / rates[currencyInfo.iso_code],
                    3,
                );
            }

            map[id].rates[eachISOCode] = value;
        });
    });
};

const jsonToRates = (json, {allowedISOCodes, defaultCurrencyISOCode}) => {
    const origCurrencyISOCode = json.base;
    const rates = {};

    rates[origCurrencyISOCode] = 1;

    Object.entries(json.rates).forEach(([key, value]) => {
        if (allowedISOCodes.includes(key)) {
            rates[key] = floorToDigits(value, 3);
        }
    });

    if (defaultCurrencyISOCode !== origCurrencyISOCode) {
        Object.keys(rates).forEach((key) => {
            if (key !== defaultCurrencyISOCode) {
                rates[key] = floorToDigits(
                    (1 / rates[defaultCurrencyISOCode]) * rates[key],
                    3,
                );
            }
        });

        rates[origCurrencyISOCode] = floorToDigits(
            1 / rates[defaultCurrencyISOCode],
            3,
        );
        rates[defaultCurrencyISOCode] = 1;
    }

    return rates;
};

module.exports = {
    jsonToRates,
    appendRatesToCurrencies,
};
