Ext.define('Financial.util.Currency', {
    singleton: true,

    getStore: function () {
        return Financial.data.currency.store;
    },

    setCurrency: function (response) {
        Financial.data.currency = Ext.JSON.decode(response.responseText);

        Financial.data.currency.store = Ext.create('Financial.store.Currency', {
            data: Ext.Object.getValues(Financial.data.currency.map)
        });
    },

    getDefaultCurrency: function () {
        return this.getCurrencyById(Financial.data.currency.default);
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

        if (from.get('iso_code') === to.get('iso_code')) {
            return value;
        }

        return value * from.get('rates')[to.get('iso_code')];
    },

    convertToDefault: function (value, from) {
        return this.convert(value, from, this.getDefaultCurrency());
    },

    getCurrencyById: function (id) {
        var store = this.getStore();

        return store.getAt(store.findExact('id', parseInt(id)));
    },

    getCurrencyByISOCode: function (ISOCode) {
        var store = this.getStore();

        return store.getAt(store.findExact('iso_code', ISOCode));
    }
});