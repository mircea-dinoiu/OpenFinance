const config = require('config');
const {basePath} = require('../helpers');
const fs = require('fs');

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

    async fetchFreshData() {
        // todo
        this.data = {
            a: new Date().toUTCString()
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