const CurrencyHelper = require('..//helpers/CurrencyHelper');
const config = require('config');
const {basePath, logError} = require('../helpers');
const fs = require('fs');
const {Currency, Setting} = require('../models');
const http = require('http');

module.exports = {
    data: null,
    defaultCurrency: null,
    cacheFilePath: basePath('storage/currencies.json'),
    currencies: null,

    async getCurrencies(fetch = false) {
        if (this.currencies == null || fetch === true) {
            this.currencies = await Currency.findAll();
        }

        return this.currencies;
    },

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

    async getCurrencyByProp(key, value) {
        const currencies = await this.getCurrencies();

        return currencies.find((each) => each[key] == value);
    },

    async convert(value, rawFrom, rawTo) {
        this.setupData();

        let from = rawFrom;
        let to = rawTo;

        if (typeof from === 'number') {
            from = await this.getCurrencyByProp('id', from);
        } else if (typeof from === 'string') {
            from = await this.getCurrencyByProp('iso_code', from);
        }

        if (typeof to === 'number') {
            to = await this.getCurrencyByProp('id', to);
        } else if (typeof to === 'string') {
            to = await this.getCurrencyByProp('iso_code', from);
        }

        if (from.iso_code === to.iso_code) {
            return value;
        }

        return value * this.data.map[from.id].rates[to.iso_code];
    },

    async convertToDefault(value, from) {
        return this.convert(value, from, (await this.getDefaultCurrency()).id);
    },

    async fetchRates(allowedISOCodes) {
        const defaultCurrencyISOCode = (await this.getDefaultCurrency())
            .iso_code;

        return new Promise((resolve) => {
            const options = {
                host: 'www.bnr.ro',
                port: 80,
                path: '/nbrfxrates.xml'
            };
            const req = http.get(options, (res) => {
                let chunks = [];

                res.on('data', (chunk) => {
                    chunks.push(chunk);
                }).on('end', () => {
                    chunks = Buffer.concat(chunks).toString();

                    const xml2js = require('xml2js');

                    xml2js.parseString(chunks, (err, xml) => {
                        const rates = CurrencyHelper.xmlToRates(xml, {
                            allowedISOCodes,
                            defaultCurrencyISOCode
                        });

                        resolve(rates);
                    });
                });
            });

            req.on('error', (e) => {
                logError(e);
                resolve(null);
            });
        });
    },

    async getDefaultCurrency() {
        if (this.defaultCurrency == null) {
            const dcInstance = await Setting.findOne({
                where: {
                    key: 'default_currency'
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
        const rawData = await this.getCurrencies(true);
        const allowedISOCodes = [];

        rawData.forEach((model) => {
            map[model.id] = model.toJSON();

            allowedISOCodes.push(model.iso_code);
        });

        const [rates, defaultCurrency] = await Promise.all([
            this.fetchRates(allowedISOCodes),
            this.getDefaultCurrency()
        ]);

        if (rates == null) {
            await this.fetchCachedData();

            return;
        }

        CurrencyHelper.appendRatesToCurrencies(map, {rates});

        this.data = {
            map,
            default: defaultCurrency.id
        };
    },

    async cacheData() {
        return new Promise((resolve) => {
            fs.writeFile(
                this.cacheFilePath,
                JSON.stringify(this.data),
                resolve
            );
        });
    },

    async setupData({update = false} = {}) {
        let fromCache = false;

        if (update !== true) {
            if ((await this.fetchCachedData()) === false) {
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
                logError(e);
                await this.fetchCachedData();
                fromCache = true;
            }
        }

        if (config.get('debug')) {
            this.data.from_cache = fromCache;
        }
    },

    async getList(req, res) {
        const update = req.query.update === 'true';

        await this.setupData({update});

        res.json(this.data);
    }
};
