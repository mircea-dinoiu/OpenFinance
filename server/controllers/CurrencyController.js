const CurrencyHelper = require('..//helpers/CurrencyHelper');
const config = require('config');
const { basePath } = require('../helpers');
const logger = require('../helpers/logger');
const fs = require('fs');
const { Currency } = require('../models');
const http = require('http');

module.exports = {
    data: null,
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

    async fetchRates(allowedISOCodes) {
        const defaultCurrencyISOCode = 'USD';

        return new Promise((resolve) => {
            const options = {
                host: 'www.bnr.ro',
                port: 80,
                path: '/nbrfxrates.xml',
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
                            defaultCurrencyISOCode,
                        });

                        resolve(rates);
                    });
                });
            });

            req.on('error', (e) => {
                logger.error(e);
                resolve(null);
            });
        });
    },

    async fetchFreshData() {
        const map = {};
        const rawData = await this.getCurrencies(true);
        const allowedISOCodes = [];

        rawData.forEach((model) => {
            map[model.id] = model.toJSON();

            allowedISOCodes.push(model.iso_code);
        });

        const rates = await this.fetchRates(allowedISOCodes);

        if (rates == null) {
            await this.fetchCachedData();

            return;
        }

        CurrencyHelper.appendRatesToCurrencies(map, { rates });

        this.data = {
            map,
            default: Number(Object.keys(map)[0]),
        };
    },

    async cacheData() {
        return new Promise((resolve) => {
            fs.writeFile(
                this.cacheFilePath,
                JSON.stringify(this.data),
                resolve,
            );
        });
    },

    async setupData({ update = false } = {}) {
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
                logger.error(e);
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

        await this.setupData({ update });

        res.json(this.data);
    },
};
