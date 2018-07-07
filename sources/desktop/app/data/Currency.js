// @ported to common/helpers/currency.js
Ext.define('Financial.data.Currency', {
    extend: 'Financial.base.StoreHandler',

    singleton: true,

    storeId: 'currency',
    storeClass: 'Financial.store.CurrencyStore',

    setCurrency: function (response) {
        Financial.data.currency = Ext.JSON.decode(response.responseText);

        Financial.data.Currency.getStore().loadData(Ext.Object.getValues(Financial.data.currency.map));
    },

    getDefaultCurrency: function () {
        var def = 'default';
        
        return this.getById(Financial.data.currency[def]);
    },

    convert: function (value, rawFrom, rawTo) {
        var from = rawFrom;
        var to = rawTo;
        
        if (Ext.isNumeric(from)) {
            from = this.getById(from);
        } else if (Ext.isString(from)) {
            from = this.getCurrencyByISOCode(from);
        }

        if (Ext.isNumeric(to)) {
            to = this.getById(to);
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

    getCurrencyByISOCode: function (ISOCode) {
        var store = this.getStore();

        return store.getAt(store.findExact('iso_code', ISOCode));
    }
});