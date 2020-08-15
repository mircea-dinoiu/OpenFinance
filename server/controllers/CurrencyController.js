const CurrencyHelper = require('..//helpers/CurrencyHelper');
const {basePath} = require('../helpers');
const logger = require('../helpers/logger');
const fs = require('fs');
const {Currency} = require('../models');
const http = require('http');
const moment = require('moment');

module.exports = class CurrencyController {
    constructor() {
        this.data = null;
        this.cacheFilePath = basePath('storage/currencies.json');
        this.currencies = null;
    }

    async getCurrencies(fetch = false) {
        if (this.currencies == null || fetch === true) {
            this.currencies = await Currency.findAll();
        }

        return this.currencies;
    }

    static isExpired(cached, compareAgainst = new Date()) {
        if (cached.date == null) {
            return true;
        }

        return moment(compareAgainst).diff(cached.date, 'days', true) >= 1;
    }

    fetchCachedData() {
        if (this.data != null) {
            return !this.constructor.isExpired(this.data);
        }

        try {
            this.data = require(this.cacheFilePath);

            return !this.constructor.isExpired(this.data);
        } catch (e) {
            return false;
        }
    }

    async fetchRates(allowedISOCodes) {
        const defaultCurrencyISOCode = 'USD';

        return new Promise((resolve) => {
            const options = {
                host: 'data.fixer.io',
                port: 80,
                path: `/api/latest?access_key=${process.env.FIXER_API_KEY}`,
            };
            const req = http.get(options, (res) => {
                let chunks = [];

                res.on('data', (chunk) => {
                    chunks.push(chunk);
                }).on('end', () => {
                    chunks = Buffer.concat(chunks).toString();

                    const rates = CurrencyHelper.jsonToRates(
                        JSON.parse(chunks),
                        {
                            allowedISOCodes,
                            defaultCurrencyISOCode,
                        },
                    );

                    resolve(rates);
                });
            });

            req.on('error', (e) => {
                logger.error(e);
                resolve(null);
            });
        });
    }

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
            this.fetchCachedData();

            return;
        }

        CurrencyHelper.appendRatesToCurrencies(map, {rates});

        this.data = {
            map,
            date: new Date().toISOString(),
        };
    }

    async cacheData() {
        return new Promise((resolve) => {
            fs.writeFile(
                this.cacheFilePath,
                JSON.stringify(this.data),
                resolve,
            );
        });
    }

    async setupData() {
        if (this.fetchCachedData()) {
            logger.log('Currencies fetched from cache');

            return;
        }

        try {
            await this.fetchFreshData();
            await this.cacheData();
        } catch (e) {
            logger.error(e);
        }
    }

    async list(req, res) {
        await this.setupData();

        res.json(this.data);
    }
};
