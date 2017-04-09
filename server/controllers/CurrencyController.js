const config = require('config');
const {basePath} = require('../helpers');
const fs = require('fs');
const {Currency, Setting} = require('../models');
const http = require('http');

module.exports = {
    data: null,
    defaultCurrency: null,
    cacheFilePath: basePath('storage/app/currencies.json'),

    async fetchCachedData() {
        return new Promise((resolve) => {
            if (this.data != null) {
                resolve(true);
            } else {
                try {
                    this.data = require(this.cacheFilePath);
                    resolve(true);
                } catch (e) {
                    resolve(false);
                }
            }
        });
    },

    async convert() {
        // todo
    },

    async convertToDefault(value, from) {
        return this.convert(value, from, await this.getDefaultCurrency());
    },

    async fetchRates(allowedISOCodes) {
        return new Promise((resolve) => {
            const options = {
                host: 'www.bnr.ro',
                port: 80,
                path: '/nbrfxrates.xml',
            };

            http.get(options, (res) => {
                let chunks = [];

                res.on('data', function(chunk) {
                    chunks.push(chunk);
                }).on('end', function() {
                    chunks = Buffer.concat(chunks).toString();

                    const xml2js = require('xml2js');

                    xml2js.parseString(chunks, (err, xml) => {
                        const body = xml.DataSet.Body[0];
                        const origCurrencyISOCode = String(body.OrigCurrency[0]);
                        const rates = {};

                        rates[origCurrencyISOCode] = 1;

                        const Rate = body.Cube[0].Rate;

                        Rate.forEach(({_, $}) => {
                            const key = $.currency;

                            if (allowedISOCodes.includes(key)) {
                                rates[key] = Number(_);
                            }
                        });

                        resolve(rates);
                    });
                });
            });
        });
    },

    async getDefaultCurrency() {
        if (this.defaultCurrency == null) {
            const dcInstance = await Setting.findOne({
                where: {
                    key: 'default_currency',
                }
            });
            const dcISOCode = dcInstance.value;
            this.defaultCurrency = await Currency.findOne({
                where: {
                    iso_code: dcISOCode
                }
            });
        }

        return this.defaultCurrency;
    },

    async fetchFreshData() {
        const map = {};
        const rawData = await Currency.findAll();
        const allowedISOCodes = [];

        rawData.forEach(model => {
            map[model.id] = model.toJSON();

            allowedISOCodes.push(model.iso_code);
        });

        const [rates, defaultCurrency] = await Promise.all([
            this.fetchRates(allowedISOCodes),
            this.getDefaultCurrency(),
        ]);

        Object.entries(map).forEach(([id, currencyInfo]) => {
            map[id].rates = {};

            Object.entries(rates).forEach(([eachISOCode]) => {
                if (currencyInfo.iso_code === eachISOCode) {
                    return;
                }

                const value = Math.round(1 / rates[eachISOCode] * rates[currencyInfo.iso_code] * (10 ** 4)) / (10 ** 4);

                map[id].rates[eachISOCode] = value;
            });
        });

        this.data = {
            map,
            'default': defaultCurrency.id,
        };
    },

    async cacheData() {
        return new Promise((resolve) => {
            fs.writeFile(this.cacheFilePath, JSON.stringify(this.data), resolve);
        });
    },

    async setupData({
        update = false
    } = {}) {
        let fromCache = false;

        if (update !== true) {
            if (await this.fetchCachedData() === false) {
                await this.fetchFreshData();
                await this.cacheData();
            } else {
                fromCache = true;
            }
        } else {
            try {
                await this.fetchFreshData();
                await this.cacheData();
            } catch (e) {
                await this.fetchCachedData();
                fromCache = true;
            }
        }

        if (config.get('debug')) {
            this.data.from_cache = fromCache;
        }
    },

    async getCurrencies({update}) {
        await this.setupData({update});

        return this.data;
    }
};