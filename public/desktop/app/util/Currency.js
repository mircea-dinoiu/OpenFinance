Ext.define('Financial.util.Currency', {
    singleton: true,

    setCurrency: function (response) {
        Financial.data.currency = Ext.JSON.decode(response.responseText);

        Financial.data.currency.store = Ext.create('Financial.store.Currency', {
            data: Ext.Object.getValues(Financial.data.currency.map)
        });
    },

    getDefaultCurrency: function () {
        return Financial.data.currency.default;
    },

    convert: function (value, from, to) {
        if (Ext.isNumeric(from)) {
            from = this.getCurrencyById(from);
        } else if (Ext.isString(from)) {
            from = this.getCurrencyByISOCode(from);
        }

        if (Ext.isNumeric(to)) {
            to = this.getCurrencyById(to);
        } else if (Ext.isString(to)) {
            to = this.getCurrencyByISOCode(to);
        }

        if (from.iso_code === to.iso_code) {
            return value;
        }

        return value * from.rates[to.iso_code];
    },

    convertToDefault: function (value, from) {
        return this.convert(value, from, this.getDefaultCurrency());
    },

    getCurrencyById: function (id) {
        return Financial.data.currency.map[id];
    },

    getCurrencyByISOCode: function (ISOCode) {
        var currency;

        Ext.Object.eachValue(Financial.data.currency.map, function (eachCurrency) {
            if (eachCurrency.iso_code === ISOCode) {
                currency = eachCurrency;
                return false;
            }
        });

        return currency;
    }
});